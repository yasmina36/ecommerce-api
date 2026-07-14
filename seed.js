require("dotenv").config();
const mongoose = require("mongoose");

const Category = require("./models/category.model");
const Cart = require("./models/cart.model");
const Order = require("./models/order.model");
const Product = require("./models/product.model");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    console.log("Deleting orders...");
    await Order.deleteMany();

    console.log("Deleting carts...");
    await Cart.deleteMany();

    console.log("Deleting products...");
    await Product.deleteMany();

    console.log("Deleting categories...");
    await Category.deleteMany();

    console.log("Old data deleted");

    const categories = await Category.create([
      {
        name: "Electronics",
        description: "Electronic devices and gadgets",
      },
      {
        name: "Clothing",
        description: "Men and women clothes",
      },
      {
        name: "Books",
        description: "Books and learning materials",
      },
    ]);

    const products = await Product.create([
      {
        name: "iPhone 15",
        description: "Apple smartphone",
        price: 1200,
        stock: 10,
        category: categories[0]._id,
        images: [],
      },
      {
        name: "Laptop",
        description: "Powerful laptop for work and study",
        price: 2500,
        stock: 5,
        category: categories[0]._id,
        images: [],
      },
      {
        name: "T-Shirt",
        description: "Cotton t-shirt",
        price: 25,
        stock: 50,
        category: categories[1]._id,
        images: [],
      },
      {
        name: "Jeans",
        description: "Blue jeans",
        price: 60,
        stock: 30,
        category: categories[1]._id,
        images: [],
      },
      {
        name: "JavaScript Book",
        description: "Learn JavaScript basics",
        price: 35,
        stock: 20,
        category: categories[2]._id,
        images: [],
      },
      {
        name: "Node.js Book",
        description: "Backend development with Node.js",
        price: 40,
        stock: 15,
        category: categories[2]._id,
        images: [],
      },
    ]);

    console.log(
      `Seed completed successfully: ${categories.length} categories and ${products.length} products inserted.`,
    );
  } catch (error) {
    console.error("Seed error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seed();
