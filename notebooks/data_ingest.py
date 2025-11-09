import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Check if keys are loaded
if not PINECONE_API_KEY or not GOOGLE_API_KEY:
    print("API keys not found. Please create a .env file and add your keys.")
else:
    print("API keys loaded successfully.")

# This is the name of our index in Pinecone
PINECONE_INDEX_NAME = "ikarus"

import pandas as pd

# Load the dataset
df = pd.read_csv('cleaned_data.csv')

# Handle potential empty rows
df.dropna(subset=['uniq_id', 'combined_text'], inplace=True)

# Display the first few rows
print(f"Loaded {len(df)} records from cleaned_data.csv")
df.head()

from langchain_huggingface import HuggingFaceEmbeddings

# Initialize the embedding model
model_name = "sentence-transformers/all-MiniLM-L6-v2"
model_kwargs = {"device": "cpu"} # Use "cuda" if you have a GPU
encode_kwargs = {"normalize_embeddings": False}

embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

print("Embedding model initialized.")

from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Check if the index already exists
if PINECONE_INDEX_NAME not in pc.list_indexes().names():
    print(f"Creating index '{PINECONE_INDEX_NAME}'...")
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=384, 
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    print("Index created successfully.")
else:
    print(f"Index '{PINECONE_INDEX_NAME}' already exists.")

# Get the index object
index = pc.Index(PINECONE_INDEX_NAME)
 
# Pass the index to LangChain
vectorstore = PineconeVectorStore(index=index, embedding=embeddings)
print("Pinecone vector store initialized successfully.")

from tqdm.auto import tqdm  # For progress bar

# We'll process the data in batches to be efficient
batch_size = 50

for i in tqdm(range(0, len(df), batch_size), desc="Upserting to Pinecone"):
    # Get the batch of data
    i_end = min(i + batch_size, len(df))
    batch = df.iloc[i:i_end]

    # Extract fields
    ids = batch["uniq_id"].astype(str).tolist()
    texts = batch["combined_text"].astype(str).tolist()

    # Prepare metadata — ensure all fields are JSON serializable
    metadata = [
        {
            "title": str(row.get("title", "")),
            "brand": str(row.get("brand", "")),
            "description": str(row.get("description", "")),
            "price": float(row.get("price", 0.0)) if pd.notnull(row.get("price")) else 0.0,
            "images": str(row.get("images", "[]")),
            "categories": str(row.get("categories", "")),
            "material": str(row.get("material", "")),
            "manufacturer": str(row.get("manufacturer", "")),
            "package_dimensions": str(row.get("package_dimensions", "")),
            "country_of_origin": str(row.get("country_of_origin", "")),
            "color": str(row.get("color", "")),
        }
        for _, row in batch.iterrows()
    ]
    # ✅ Add documents to Pinecone via LangChain vectorstore
    # (LangChain handles embedding and upsert automatically)
    vectorstore.add_texts(texts=texts, ids=ids, metadatas=metadata)

print("\n--- Embedding and Upserting Complete ---")
print(f"All {len(df)} product records have been processed and stored in the '{PINECONE_INDEX_NAME}' index.")