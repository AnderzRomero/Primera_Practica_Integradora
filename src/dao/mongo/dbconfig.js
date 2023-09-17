import mongoose from "mongoose";

const connection = "mongodb+srv://coder:ander1234@cluster0.9vhlkqi.mongodb.net/ecommerce?retryWrites=true&w=majority";

await mongoose.connect(connection, { serverSelectionTimeoutMS: 5000, });

console.log("Base de datos conectada con exito");



