import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:[true, "Category Name is required!"],
        trim:true,
        minlength:[2, "Category Name must be atleast 2 characters!"],
        minlength:[30, "Category Name must be less than 50 characters!"],
        match:[/^[A-Za-z0-9\s]+$/,"Category name should contain only letters, numbers and spaces"]
    },
    unit:{
        type: String,
        enum: {
        values: ["kg", "g", "liters", "ml", "pieces", "bags", "units", "tons"],
        message: "Unit must be one of: kg, g, liters, ml, pieces, bags, units, tons",
        },
        required:[true, "Unit is required!"],
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "Owner Id is required!"],
        index:true
    },

},{timestamps:true})

categorySchema.index({ownerId:1, categoryName:1},  {unique:true});

export const Category = mongoose.model("Category", categorySchema);