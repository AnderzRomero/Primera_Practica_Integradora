import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.9vhlkqi.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

await mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000, })
    .then(() => console.log("Base de datos conectada con exito"))
    .catch(e => console.log(e));







