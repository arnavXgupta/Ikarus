import os
import json
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# --- 4. LAZY INITIALIZATION VARIABLES ---
embeddings = None
vectorstore = None
llm = None

def initialize_models():
    """Initialize heavy models only once (when first needed)."""
    global embeddings, vectorstore, llm

    if embeddings is None:
        print("Initializing embedding model...")
        from langchain_huggingface import HuggingFaceEmbeddings
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    if vectorstore is None:
        print("Initializing Pinecone vector store...")
        from langchain_pinecone import PineconeVectorStore
        vectorstore = PineconeVectorStore(index_name=PINECONE_INDEX_NAME, embedding=embeddings)

    if llm is None:
        print("Initializing Generative AI model...")
        from langchain_google_genai import ChatGoogleGenerativeAI
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=GOOGLE_API_KEY)

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
        with open('../notebooks/analytics_data.json', 'r') as f:
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
        raw_text = doc.page_content
        material = ""
        try:
            material = raw_text.split(' | ')[-2]
        except IndexError:
            pass

        generated_description = chain.invoke({
            "title": doc.metadata.get('title', ''),
            "brand": doc.metadata.get('brand', ''),
            "material": material
        })

        recommendations.append(
            RecommendedProduct(
                title=doc.metadata.get('title', 'No Title'),
                brand=doc.metadata.get('brand', 'No Brand'),
                price=doc.metadata.get('price', 0.0),
                images=doc.metadata.get('images', '[]'),
                generated_description=generated_description
            )
        )

    return recommendations
