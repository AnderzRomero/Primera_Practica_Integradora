import mongoose from "mongoose";

const collection = "students";

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dni: {
        type: String,
        required: true,
        unique:true
    },
    course: {
        type: String,
        enum: ["backend", "frontend"],
        default: "backend"
    },
    grade: {
        type:Number,
        required:true
    }
})

const studentModel = mongoose.model(collection,schema);

export default studentModel;