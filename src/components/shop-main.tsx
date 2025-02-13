"use client";

import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { allProducts } from "@/sanity/lib/quires";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useCart } from "@/components/cart-context";

import mainsofa from "/public/mainsofa.png";
import mainchairs from "/public/mainchairs.png";
import maindyning from "/public/maindyning.png";
import maintable from "/public/maintable.png";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartContextType {
  dispatch: (action: { type: string; payload: Product }) => void;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Trenton modular sofa_3",
    price: 250000.0,
    image: mainsofa.src,
  },
  {
    id: "2",
    name: "Outdoor bar table and stool",
    price: 250000.0,
    image: mainchairs.src,
  },
  {
    id: "3",
    name: "Granite dining table with dining chair",
    price: 250000.0,
    image: maindyning.src,
  },
  {
    id: "4",
    name: "Plain console with teak mirror",
    price: 250000.0,
    image: maintable.src,
  },
];

export default function ShopMain() {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const cartContext = useCart() as CartContextType;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetched = await client.fetch(allProducts);
        setFetchedProducts(
          fetched.map((product: { _id: string; name: string; price: number; image?: string }) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image ? urlFor(product.image).url() : "",
            quantity: 1,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();
  }, []);

  if (!cartContext || !cartContext.dispatch) {
    return <p>Loading...</p>;
  }

  const { dispatch } = cartContext;

  const addToCart = (product: Product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1 },
    });
    toast.success(`${product.name} added to cart!`);
  };

  const allProductsList = [...products, ...fetchedProducts];

  return (
    <section className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Fetched Product From Sanity</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {allProductsList.map((product) => (
          <Card key={product.id} className="border-none shadow-none group relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:rotate-3 hover:-translate-y-2">
            <CardHeader className="p-0">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                {product.image && (
                  <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Button variant="secondary" className="w-40" onClick={() => addToCart(product)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <div className="flex gap-2">
                      <Link href={`/shop/${product.id}`}>
                        <Button variant="secondary" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="secondary" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Link href={`/shop/${product.id}`}>
                <CardTitle className="text-base font-medium line-clamp-2 hover:underline">{product.name}</CardTitle>
              </Link>
            </CardContent>
            <CardFooter>
              <p className="text-lg font-semibold">Rs. {product.price.toLocaleString()}</p>
            </CardFooter>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 pointer-events-none"></div>
          </Card>
        ))}
      </div>
    </section>
  );
}


