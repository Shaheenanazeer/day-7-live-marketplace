
  
const orderSchema = {
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    { name: "firstName", type: "string", title: "First Name" },
    { name: "lastName", type: "string", title: "Last Name" },
    { name: "address", type: "string", title: "Address" },
    { name: "city", type: "string", title: "City" },
    { name: "zipCode", type: "string", title: "Zip Code" },
    { name: "phone", type: "string", title: "Phone" },
    { name: "email", type: "string", title: "Email" },
    {
      name: "cartItems",
      type: "array",
      title: "Cart Items",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    },
    { name: "orderDate", type: "datetime", title: "Order Date" },
  ],
};

export default orderSchema;
