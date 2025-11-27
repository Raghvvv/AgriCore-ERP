import mongoose from "mongoose";


const stockSchema = new mongoose.Schema({
    
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    quantity:{
        type:Number,
        required:true,
        default:0,
    },

},{timestamps:true})

export const Stock = mongoose.model("Stock", stockSchema);