import pandas as pd
import json
import ast # To safely evaluate string-formatted lists

df = pd.read_csv('intern_data_ikarus.csv')

# Fill NaN values in object columns with an empty string
for col in ['description', 'brand', 'manufacturer', 'package_dimensions', 'country_of_origin', 'material', 'color']:
    df[col] = df[col].fillna('')

# Clean and convert 'price' column
# Remove '$' and convert to numeric, coercing errors to NaN
df['price'] = df['price'].astype(str).str.replace('$', '', regex=False).str.replace(',', '', regex=False)
df['price'] = pd.to_numeric(df['price'], errors='coerce')

# Fill missing prices with the median price
median_price = df['price'].median()
df['price'] = df['price'].fillna(median_price)

# Check the dtypes and missing values again
print("Cleaned Dataset Information:")
df.info()

print("\nPrice column after cleaning:")
print(df['price'].describe())

def parse_categories(cat_str):
    try:
        # The string looks like "['Home & Kitchen', ...]", so ast.literal_eval is perfect
        cat_list = ast.literal_eval(cat_str)
        return ' '.join(cat_list)
    except (ValueError, SyntaxError):
        # Return empty string if parsing fails
        return ''

df['categories_str'] = df['categories'].apply(parse_categories)
top_10_brands = df['brand'].value_counts().nlargest(10)
top_10_materials = df[df['material'] != '']['material'].value_counts().nlargest(10)

# Create the combined feature for embedding
df['combined_text'] = (
    df['title'].astype(str) + ' | ' +
    df['brand'].astype(str) + ' | ' +
    df['description'].astype(str) + ' | ' +
    df['categories_str'].astype(str) + ' | ' +
    df['material'].astype(str) + ' | ' +
    df['color'].astype(str)
)

print("Sample of the combined_text feature:")
print(df[['title', 'combined_text']].head())

# We select only the necessary columns to keep the file size minimal for the next step.
# title,brand,description,price,categories,images,manufacturer,package_dimensions,country_of_origin,material,color,uniq_id

columns_to_keep = [
    'uniq_id', 'title', 'brand', 'description', 'price', 'images',
    'categories', 'material', 'manufacturer', 'package_dimensions', 'country_of_origin', 'color', 'combined_text'
]
cleaned_df = df[columns_to_keep]
cleaned_df.to_csv('cleaned_data.csv', index=False)
print("Cleaned data saved to 'cleaned_data.csv'")

# 2. Prepare and save analytics data as JSON
# Note: Converting numpy types to native Python types for JSON serialization
analytics_data = {
    'price_distribution': {
        'prices': df[df['price'] < df['price'].quantile(0.95)]['price'].tolist() # Send sample for histogram
    },
    'top_brands': {
        'brands': top_10_brands.index.tolist(),
        'counts': [int(c) for c in top_10_brands.values]
    },
    'top_materials': {
        'materials': top_10_materials.index.tolist(),
        'counts': [int(c) for c in top_10_materials.values]
    }
}

with open('analytics_data.json', 'w') as f:
    json.dump(analytics_data, f, indent=4)

print("\nAnalytics data saved to 'analytics_data.json'")
print("\n--- JSON Content ---")
print(json.dumps(analytics_data, indent=2))