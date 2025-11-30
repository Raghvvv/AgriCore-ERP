import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Quantity cannot be negative"], // no negative values
      validate: {
        validator: Number.isInteger, // only whole numbers
        message: "Quantity must be a whole number",
      },
    },
  },
  { timestamps: true }
);

stockSchema.index({owner:1, item:1}, {unique:false})

export const Stock = mongoose.model("Stock", stockSchema);
