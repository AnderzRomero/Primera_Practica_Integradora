import productModel from "../models/product.model.js"

export default class productsManager {

    getProducts = (params) => {
        return productModel.find(params).lean();
    }

    getProductBy = (params) => {
        return productModel.findOne(params).lean();
    }

    addProduct = (product) => {
        return productModel.create(product);
    }

    updateProduct = (id, product) => {
        return productModel.updateOne({ _id: id }, { $set: product });
    }

    deleteProduct = (id) => {
        return productModel.deleteOne({ _id: id });
    }
}