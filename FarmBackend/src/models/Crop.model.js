import mongoose from "mongoose";


const cropSchema = new mongoose.Schema({
    cropName:{
        type:String,
        required:true,
        unique:true
    },
    plantingDate:{
        type:Date,
        required:true,
    },
    harvestingDate:{
        type:Date,
        required:true,
    },
    actualYield:{
        type:Number,
        default:null,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["Planted", "Harvested"],
        default:"Planted",
        required:true
    },
    itemUsed:[
        {
            itemId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Item",
                required:true
            },
            itemName:{
                type:String,
                required:true,
            },

            quantity:{
                type:Number,
                required:true
            },
        
        }
    ],

},{timestamps:true});

export const Crop = mongoose.model("Crop", cropSchema);