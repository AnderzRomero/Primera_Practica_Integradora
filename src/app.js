import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import "./dao/mongo/dbConfig.js";
import __dirname from "./utils.js"
import productsManager from "./dao/mongo/managers/productsManager.js";
import messagesManager from "./dao/mongo/managers/messagesManager.js";


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

//rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

const productServices = new productsManager();
const messageServices = new messagesManager();

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado con id: ", socket.id);

  const listProducts = await productServices.getProducts();
  socketServer.emit("sendProducts", listProducts);

  socket.on("addProduct", async (obj) => {
    await productServices.addProduct(obj);
    const listProducts = await productServices.getProducts({});
    socketServer.emit("sendProducts", listProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await productServices.deleteProduct(id);
    const listProducts = await productServices.getProducts({});
    socketServer.emit("sendProducts", listProducts);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
  socket.on("newUser", (usuario) => {
    console.log("usuario", usuario);
    socket.broadcast.emit("broadcast", usuario);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario con ID : ${socket.id} esta desconectado `);
  });

  socket.on("message", async (info) => {
    // Guardar el mensaje utilizando el MessagesManager
    console.log(info);
    await messageServices.createMessage(info);
    // Emitir el mensaje a todos los clientes conectados
    socketServer.emit("chat", await messageServices.getMessages());
  });
});