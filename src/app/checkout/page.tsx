
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import shopheader from "/public/shopheader.png"; 
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { client } from "@/sanity/lib/client";
// import { Product } from "../../../types/products";

const Checkout: React.FC = () => {
  const { state } = useCart();
  // const [paymentMethod, setPaymentMethod] = useState("bank");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    zipCode: false,
    phone: false,
    email: false,
  });

  const validateForm = () => {
    const errors = {
      firstName: !formValues.firstName,
      lastName: !formValues.lastName,
      address: !formValues.address,
      city: !formValues.city,
      zipCode: !formValues.zipCode,
      phone: !formValues.phone,
      email: !formValues.email,
    };
    setFormErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    console.log("Place Order button clicked");

    if (!validateForm()) {
      console.log("Form is invalid. Please fill all required fields.");
      return;
    }

    console.log("Cart Items:", state.items);

    const orderData = {
      _type: "order",
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      address: formValues.address,
      city: formValues.city,
      zipCode: formValues.zipCode,
      phone: formValues.phone,
      email: formValues.email,
      cartItems: state.items.map((item) => ({
        _type: "reference",
        _ref: item._id,
      })),
      orderDate: new Date().toISOString(),
    };

    console.log("Sending order data to Sanity:", orderData);

    try {
      await client.create(orderData);
      console.log("Order successfully created in Sanity");
      localStorage.removeItem("appliedDiscount");
      setDialogOpen(true); // Open the success dialog
    } catch (error) {
      console.error("Error creating order", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    router.push("/shop");
  };

  return (
    <div>
      <div className="relative h-[300px] w-full">
        <Image src={shopheader} alt="Shop Header" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Image src="/brand.png" alt="logo" width={77} height={77} />
          <h1 className="text-4xl font-bold text-black">Checkout</h1>
          <div className="mt-4 flex items-center space-x-2 text-sm text-black">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>›</span>
            <Link href="/cart" className="hover:underline">
              Checkout
            </Link>
          </div>
        </div>
      </div>

      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Billing Details Form */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Billing Details</h1>
              <form className="space-y-4">
                {Object.entries(formValues).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-lg font-semibold" htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      placeholder={`Enter your ${key}`}
                      className={`w-full p-3 border ${
                        formErrors[key as keyof typeof formErrors] ? "border-red-500" : "border-gray-300"
                      } rounded-md`}
                    />
                    {formErrors[key as keyof typeof formErrors] && (
                      <p className="text-red-500 text-sm mt-1">This field is required.</p>
                    )}
                  </div>
                ))}
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">
                Product <span className="text-end">Subtotal</span>
              </h1>
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>Rs. {state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rs. {state.total.toLocaleString()}</span>
                </div>
              </div>
              <hr className="my-4" />
              <Button
                className="w-full py-2 bg-transparent border border-black rounded-md text-black text-lg hover:bg-black hover:text-white transition"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Order Placed Successfully
            </DialogTitle>
            <DialogDescription>
              Your order has been placed successfully. Thank you for shopping with us!
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button onClick={handleCloseDialog} className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;


