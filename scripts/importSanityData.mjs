 import { createClient } from '@sanity/client';
import fetch from 'node-fetch';

const client = createClient({
  projectId: "7h9fzpzu",
  dataset: "production",
  useCdn: false, 
  apiVersion: '2025-01-13',
  token: "skicPUauQu9WRH6QKvq2JlwCeodqTwjkBxdRtFXVQWZ6CNROlEKWSgS6ZopAVPmmJIDm8mX4nRfcZ0OLfkKYZqy13WCQYOOBQFktlrgIpgOowtk5MthlFm6WygAqM6nBzmQhtz9FkpPmpqjVEljasXIlwS58hCi2fywsWPv5bgiMuQ7Vm16X ", // Replace with your Sanity token
});

async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${imageUrl}`);
    }

    const buffer = await response.arrayBuffer();
    const bufferImage = Buffer.from(buffer);

    const asset = await client.assets.upload('image', bufferImage, {
      filename: imageUrl.split('/').pop(),
    });

    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error);
    return null;
  }
}

async function uploadProduct(product) {
  try {
    const imageId = await uploadImageToSanity(product.imagePath);

    if (imageId) {
      const document = {
        _type: 'product',
        id: product.id,
        name: product.name,
        image: {
          _type: 'image',
          asset: {
            _ref: imageId,
          },
        },
        price: parseFloat(product.price), 
        description: product.description,
        discountPercentage: product.discountPercentage,
        isFeaturedProduct: product.isFeaturedProduct,
        stockLevel: product.stockLevel,
        category: product.category,
      };

      const createdProduct = await client.create(document);
      console.log(`Product "${product.name}" uploaded successfully:`, createdProduct);
    } else {
      console.log(`Product "${product.name}" skipped due to image upload failure.`);
    }
  } catch (error) {
    console.error('Error uploading product:', error);
  }
}

async function migrateProducts() {
  try {
    const response = await fetch('https://template-0-beta.vercel.app/api/product');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const products = await response.json();

    for (const product of products) {
      await uploadProduct(product);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

migrateProducts();