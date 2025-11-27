import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName:{
        type:String,
        unique:true,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    price:{
        type: Number,
        required:true,
    },
},{timestamps:true})

export const Item = mongoose.model("Item", itemSchema );