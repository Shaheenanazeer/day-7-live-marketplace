import { products } from '@/components/shop-main'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ message: "Product added", product: body })
}

