import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productsManager.js";

const router = Router();
const productsService = new ProductManager();

router.get("/", async (req, res) => {
  const listaProductos = await productsService.getProducts();
  res.render("home", { listaProductos });
});

router.get("/realTimeProducts", async (req, res) => {
  const listaProductos = await productsService.getProducts();
  res.render("realTimeProducts", { listaProductos });
});

router.get("/messages", (req, res) => {
  res.render("messages");
});

export default router;
