# import os
import json
import gc
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- 1. LOAD ENVIRONMENT VARIABLES ---
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PINECONE_INDEX_NAME = "ikarus"

# --- 2. SETUP FASTAPI APP FIRST ---
app = FastAPI(
    title="Product Recommendation API",
    description="API for furniture product recommendations and analytics.",
)

origins = [
    "https://ikarus-3s4a.vercel.app",  # Your deployed Vercel URL
    "http://localhost:3000",  # Your local development URL (good to keep)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. DEFINE Pydantic MODELS ---
class Query(BaseModel):
    prompt: str

class RecommendedProduct(BaseModel):
    title: str
    brand: str
    price: float
    images: str
    generated_description: str
    dimensions: str = "N/A"
    countryOfOrigin: str = "N/A"
    color: str = "N/A"
    material: str = "N/A"
    manufacturer: str = "N/A"

# --- 4. LAZY INITIALIZATION VARIABLES ---
embeddings = None
vectorstore = None
llm = None

def initialize_models():
    """Initialize heavy models only once (when first needed)."""
    global embeddings, vectorstore, llm
    
    if embeddings is None:
        print("Initializing FastEmbed embedding model...")
        from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
        
        # FastEmbed uses ~100-150MB RAM vs 400-500MB for HuggingFace
        embeddings = FastEmbedEmbeddings(
            model_name="BAAI/bge-small-en-v1.5",  # Default FastEmbed model
            max_length=512,
            threads=1  # Limit threads for low-resource environments
        )
        gc.collect()  # Force garbage collection after initialization
        print("FastEmbed model loaded successfully!")
    
    if vectorstore is None:
        print("Initializing Pinecone vector store...")
        from langchain_pinecone import PineconeVectorStore
        vectorstore = PineconeVectorStore(index_name=PINECONE_INDEX_NAME, embedding=embeddings)
        print("Pinecone vector store initialized!")
    
    if llm is None:
        print("Initializing Generative AI model...")
        from langchain_google_genai import ChatGoogleGenerativeAI
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=GOOGLE_API_KEY)
        print("LLM initialized!")

# --- 5. ENDPOINTS ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Product Recommendation API!"}

@app.get("/health")
def read_health():
    return {"message": "Healthy"}

@app.get("/analytics")
def get_analytics_data():
    try:
        with open('./analytics_data.json', 'r') as f:
            analytics_data = json.load(f)
        return analytics_data
    except FileNotFoundError:
        return {"error": "Analytics data not found."}
    except Exception as e:
        return {"error": str(e)}

@app.post("/recommend", response_model=list[RecommendedProduct])
def get_recommendations(query: Query):
    initialize_models()  # <--- Initialize here (first request)
    
    from langchain_core.prompts import PromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.runnables import RunnablePassthrough
    
    retriever = vectorstore.as_retriever(search_kwargs={'k': 3})
    
    template = """
You are a creative marketing assistant for a furniture store.
Based on the following product details, write a short, engaging, and creative product description (2-3 sentences).

Product Details:
- Title: {title}
- Brand: {brand}
- Material: {material}

Creative Description:
"""
    
    prompt = PromptTemplate.from_template(template)
    
    chain = (
        {"title": RunnablePassthrough(), "brand": RunnablePassthrough(), "material": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    similar_docs = retriever.invoke(query.prompt)
    
    recommendations = []
    for doc in similar_docs:
        # Extract data from metadata and text field
        title = doc.metadata.get('title', 'No Title')
        brand = doc.metadata.get('brand', 'No Brand')
        
        # Try to get additional fields from metadata first, then fall back to text parsing
        material = doc.metadata.get('material', 'N/A')
        color = doc.metadata.get('color', 'N/A')
        dimensions = doc.metadata.get('package_dimensions', 'N/A')
        countryOfOrigin = doc.metadata.get('country_of_origin', 'N/A')
        manufacturer = doc.metadata.get('manufacturer', 'N/A')
        
        # If fields are still N/A, try to extract from text field (combined_text)
        if material == 'N/A' or color == 'N/A':
            text_content = doc.metadata.get('text', doc.page_content)
            parts = text_content.split(' | ')
            if len(parts) >= 6:
                if material == 'N/A':
                    material = parts[4] if parts[4] else 'N/A'
                if color == 'N/A':
                    color = parts[5] if parts[5] else 'N/A'
        
        generated_description = chain.invoke({
            "title": title,
            "brand": brand,
            "material": material
        })
        
        recommendations.append(
            RecommendedProduct(
                title=title,
                brand=brand,
                price=doc.metadata.get('price', 0.0),
                dimensions=dimensions,
                countryOfOrigin=countryOfOrigin,
                color=color,
                material=material,
                manufacturer=manufacturer,
                images=doc.metadata.get('images', '[]'),
                generated_description=generated_description
            )
        )
    
    return recommendations
