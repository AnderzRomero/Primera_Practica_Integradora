import mongoose from "mongoose";

const collection = "Products";

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
            required: false,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const productModel = mongoose.model(collection, schema);

export default productModel;
