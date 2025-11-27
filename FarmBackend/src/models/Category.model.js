import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true,
    },
    unit:{
        type: String,
        enum: ["kg", "g", "liters", "ml", "pieces", "bags", "units"],
        required: true,
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

},{timestamps:true})

export const Category = mongoose.model("Category", categorySchema);