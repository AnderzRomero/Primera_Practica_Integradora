import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/productsManager.js";
import { __dirname } from "./utils.js";
import userModel from "./models/product.model.js";
import mongoose from "mongoose";
import productModel from "./models/product.model.js";
import studentModel from "./models/students.js";
import req from "express/lib/request.js";
import res from "express/lib/response.js";


const app = express();

const PORT = process.env.PORT || 8080;

const connection = mongoose.connect("mongodb+srv://coder:ander1234@cluster0.9vhlkqi.mongodb.net/colegio?retryWrites=true&w=majority")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

//rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// app.use("/", viewsRouter);

app.get('/', async (req, res) => {
  const products = await productModel.find()
  res.send({ products });
});

// app.get('/students', async (req, res) => {
//   const students = [
//     { firstName: "Anderson", lastName: "Romero", age: "32", dni: "1234556712", grade: 10 },
//     { firstName: "Sebastian", lastName: "Roncancio", age: "22", dni: "1221425712", grade: 8 },
//     { firstName: "Camilo", lastName: "Roncancio", age: "28", dni: "54563556712", grade: 10 },
//     { firstName: "Mauricio", lastName: "Espinoza", age: "27", dni: "4567568913", grade: 5 },
//   ];
//   const result = await studentModel.insertMany(students);
//   res.send({ status: "success", payload: result })
// });

app.get('/students', async (req, res) => {
  const students = await studentModel.find()
  res.send({status:"success",payload:students});
});

app.get('/students/:dni', async(req,res) =>{
  const {dni} = req.params;
  const student = await studentModel.findOne({dni:dni})
  if(!student) return res.status(404).send({status:"error",error:"Estudiante no encontrado"})
  res.send({status:"seccess",payload:student})
} )

app.post('/students', async (req, res) => {
  const {
    firstName,
    lastName,
    age,
    dni,
    course,
    grade
  } = req.body;
  if (!firstName || !lastName || !age || !dni || !grade) return res.status(400).send({ status: "error", error: "Datos Incompletos" })
  const newStudent = {
    firstName,
    lastName,
    age,
    dni,
    grade,
    course
  }
  const result = await studentModel.create(newStudent);
  res.send({ status: "success", payload: result._id })
})



const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const pmanager = new ProductManager(__dirname + "/files/products.json");
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado con id: ", socket.id);

  const listProducts = await pmanager.getProducts({});
  socketServer.emit("sendProducts", listProducts);

  socket.on("addProduct", async (obj) => {
    await pmanager.addProduct(obj);
    const listProducts = await pmanager.getProducts({});
    socketServer.emit("sendProducts", listProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await pmanager.deleteProduct(id);
    const listProducts = await pmanager.getProducts({});
    socketServer.emit("sendProducts", listProducts);
  });
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});