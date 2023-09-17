import { Router } from "express";
import cartManager from "../dao/mongo/managers/cartsManager.js";
import productsManager from "../dao/mongo/managers/productsManager.js";
import __dirname from "../utils.js";

const router = Router();
const cartService = new cartManager();
const productService = new productsManager();

router.get("/", async (req, res) => {
  const carts = await cartService.getCarts();
  if (carts.length === 0) {
    res.status(200).json({ message: "No hay carros creados" });
  } else {
    res.status(200).json({ carts });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartService.getCartById({ _id: cid });
  if (!cart) {
    res.status(400).json({ message: "Producto no encontrado" });
  } else {
    res.send({ status: "success", payload: cart })
  }
});

router.post("/", async (req, res) => {
  const cart = await cartService.addCart();
  if (cart) {
    res.status(201).json({ message: "Carrito creado", cart });
  } else {
    res.status(400).json({ message: "Error al crear carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const checkIdProduct = await productManager.getProductById(pid);
    if (!checkIdProduct) {
      return res
        .status(404)
        .send({ message: `Product with ID: ${pid} not found` });
    }

    const checkIdCart = await cartManager.getCartById(cid);
    if (!checkIdCart) {
      return res
        .status(404)
        .send({ message: `Cart with ID: ${cid} not found` });
    }

    const result = await cartManager.addProductInCart(cid, {
      _id: pid,
      quantity: quantity,
    });
    console.log(result);
    return res.status(200).send({
      message: `Product with ID: ${pid} added to cart with ID: ${cid}`,
      cart: result,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .send({ message: "An error occurred while processing the request" });
  }
});

export default router;
