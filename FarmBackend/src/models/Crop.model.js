import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
      minlength: [2, "Crop name must be at least 2 characters"],
      maxlength: [50, "Crop name must be less than 50 characters"],
      match: [
        /^[A-Za-z0-9\s-]+$/,
        "Crop name can contain only letters, numbers, spaces, and hyphens",
      ],
    },

    cropVariety: {
      type: String,
      trim: true,
      maxlength: [50, "Crop variety must be less than 50 characters"],
      default: null,
    },

    plantingDate: {
      type: Date,
      required: [true, "Planting date is required"],
      validate: {
        validator: (v) => v <= new Date(),
        message: "Planting date cannot be in the future",
      },
    },

    harvestingDate: {
      type: Date,
      required: [true, "Harvesting date is required"],
      validate: {
        validator: function (v) {
          return v >= this.plantingDate;
        },
        message: "Harvesting date cannot be before planting date",
      },
    },

    harvestedAt: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          // If set, harvestedAt must be after plantingDate
          if (!v) return true;
          return v >= this.plantingDate;
        },
        message: "Harvested date cannot be before planting date",
      },
    },

    actualYield: {
      type: Number,
      default: null,
      min: [0, "Yield cannot be negative"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },

    status: {
      type: String,
      enum: ["Planted", "Harvested"],
      default: "Planted",
      required: true,
    },
    actualYield: {
      type: Number,
      min: [0, "Yield cannot be negative"],
      validate: {
        validator: function (v) {
          // If yield is provided, it must be a number greater than 0
          if (v === null || v === undefined) return true; // allow empty because harvesting not done yet
          return v >= 0;
        },
        message: "Yield must be a positive number",
      },
    },
    itemUsed: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        itemName: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [0, "Quantity must be positive"],
          validate: Number.isInteger,
        },
      },
    ],
  },
  { timestamps: true }
);

cropSchema.index({ owner: 1, cropName: 1 }, { unique: true });

export const Crop = mongoose.model("Crop", cropSchema);
