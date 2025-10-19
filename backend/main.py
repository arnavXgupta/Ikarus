import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# LangChain Imports
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# --- 1. LOAD ENVIRONMENT VARIABLES ---
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PINECONE_INDEX_NAME = "ikarus"

# --- 2. INITIALIZE MODELS AND VECTORSTORE ---

# Initialize embedding model from HuggingFace
print("Initializing embedding model...")
model_name = "sentence-transformers/all-MiniLM-L6-v2"
embeddings = HuggingFaceEmbeddings(model_name=model_name)

# Initialize Pinecone vector store
print("Initializing Pinecone vector store...")
vectorstore = PineconeVectorStore(index_name=PINECONE_INDEX_NAME, embedding=embeddings)

# Initialize Google Gemini model for creative descriptions
print("Initializing Generative AI model...")
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=GOOGLE_API_KEY)


# --- 3. SETUP FASTAPI APP ---
print("Setting up FastAPI app...")
app = FastAPI(
    title="Product Recommendation API",
    description="API for furniture product recommendations and analytics.",
)

# CORS (Cross-Origin Resource Sharing) Middleware
# Allows the React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- 4. DEFINE Pydantic MODELS (for request and response data validation) ---

class Query(BaseModel):
    """Request model for user query."""
    prompt: str

class RecommendedProduct(BaseModel):
    """Response model for a single recommended product."""
    title: str
    brand: str
    price: float
    images: str
    generated_description: str


# --- 5. DEFINE API ENDPOINTS ---

@app.get("/")
def read_root():
    """Root endpoint to check if the API is running."""
    return {"message": "Welcome to the Product Recommendation API!"}


@app.get("/analytics")
def get_analytics_data():
    """
    Endpoint to serve the pre-computed analytics data.
    It reads the JSON file created by the data_analytics notebook.
    """
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
    """
    Main endpoint to get product recommendations.
    - Takes a user's text prompt.
    - Performs a similarity search in Pinecone.
    - Generates a new creative description for each result using a GenAI model.
    """
    # Set up a retriever for similarity search
    retriever = vectorstore.as_retriever(search_kwargs={'k': 3}) # Retrieve top 3 results

    # Define the prompt template for the GenAI model
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

    # Create a LangChain Expression Language (LCEL) chain
    chain = (
        {"title": RunnablePassthrough(), "brand": RunnablePassthrough(), "material": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    # 1. Perform similarity search
    similar_docs = retriever.invoke(query.prompt)

    recommendations = []
    for doc in similar_docs:
        # 2. For each similar doc, generate a new description
        # We need to extract the raw text to get material info if it exists
        raw_text = doc.page_content
        # A simple way to extract material from the combined_text
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

        # 3. Append to our results
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


# To run the app, use the command: uvicorn main:app --reload
print("FastAPI app setup complete. Ready to run.")