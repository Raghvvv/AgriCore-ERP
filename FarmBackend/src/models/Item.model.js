import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [2, "Item name must be at least 2 characters"],
      maxlength: [50, "Item name must be less than 50 characters"],
      match: [/^[A-Za-z0-9\s]+$/, "Item name should only contain letters, numbers and spaces"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [1000000, "Price too large"],
    },
},{timestamps:true})

itemSchema.index({category:1, itemName:1}, {unique:true})

export const Item = mongoose.model("Item", itemSchema );