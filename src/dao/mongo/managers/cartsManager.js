import cartModel from "../models/cart.model.js"

export default class cartManager {
    getCarts = (params) => {
        return cartModel.find(params).lean();
    }

    getCartById = (params) => {
        return cartModel.findOne(params).lean();
    }

    addCart = async (products) => {
        try {
            let cartData = {};
            if (products && products.length > 0) {
                cartData.products = products;
            }

            const cart = await cartModel.create(cartData);
            return cart;
        } catch (err) {
            console.error("Error al crear el carrito:", err.message);
            return err;
        }
    }

    addProductInCart = async (cid, obj) => {
        try {
          const filter = { _id: cid, "products._id": obj._id };
          const cart = await cartModel.findById(cid);
          const findProduct = cart.products.some(
            (product) => product._id.toString() === obj._id
          );
    
          if (findProduct) {
            const update = { $inc: { "products.$.quantity": obj.quantity } };
            await cartModel.updateOne(filter, update);
          } else {
            const update = {
              $push: { products: { _id: obj._id, quantity: obj.quantity } },
            };
            await cartModel.updateOne({ _id: cid }, update);
          }
    
          return await cartModel.findById(cid);
        } catch (err) {
          console.error("Error al agregar el producto al carrito:", err.message);
          return err;
        }
      };

    updateCart = (id, cart) => {
        return cartModel.updateOne({ _id: id }, { $set: cart });
    }

    deleteCart = (id) => {
        return cartModel.deleteOne({ _id: id });
    }

}