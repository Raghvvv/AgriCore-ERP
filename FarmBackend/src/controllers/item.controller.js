import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Item } from "../models/Item.model.js";
import { Stock } from "../models/Stock.model.js";
import { Category } from "../models/Category.model.js";
import { application, response } from "express";
import mongoose from "mongoose";

const addCategory = asyncHandler(async (req, res) => {
  const { categoryName, unit } = req.body;

  if (!categoryName || !unit) {
    throw new ApiError(404, "All fields are required! ", false);
  }

  const newCategory = await Category.create({
    categoryName,
    unit,
    ownerId: req.user?._id,
  });

  if (!newCategory) {
    throw new ApiError(
      404,
      "New Category creation got failed, plese try again! ",
      false
    );
  }

  return res
    .status(200)
    .json(new ApiResponse("Category created!! ", 200, { newCategory }));
});

const addItem = asyncHandler(async (req, res) => {
  console.log("here");

  const { itemName, quantity, price, categoryName } = req.body;

  if (!itemName || !quantity || !price || !categoryName) {
    throw new ApiError(400, "All fields are necessary! ", false);
  }

  const user = req.user?._id;
  //get the category from the table
  const retCategory = await Category.findOne({
    $or: [{ user }, { categoryName }],
  });

  //if no such category exists
  if (!retCategory) {
    throw new ApiError(404, "No such category exists", false);
  }

  const item = await Item.create({
    itemName: itemName,
    price,
    category: retCategory?._id,
  });

  if (!item) {
    throw new ApiError(500, "Something wrong with Database", false);
  }

  const itemStock = await Stock.create({
    item: item?._id,
    owner: req.user?._id,
    quantity: quantity,
  });

  if (!itemStock) {
    throw new ApiError(500, "Something wrong with Database", false);
  }
  console.log("here");

  return res.status(200).json(
    new ApiResponse("Successfull add item", 200, {
      item,
      itemStock,
    })
  );
});

const getItems = asyncHandler(async (req, res) => {
  const itemsArray = await Stock.find({ owner: req.user?._id }).populate(
    "item",
    "itemName category price"
  );

  if (!itemsArray) {
    throw new ApiError(404, "Bad request");
  }

  const responseData = itemsArray.map((stk) => ({
    ...stk.item.toObject(),
    quantity: stk.quantity,
    itemId: stk.item._id,
    stockId: stk._id,
  }));

  return res
    .status(200)
    .json(new ApiResponse("Successfull data retreival", 200, responseData));
});

//update item
const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const allowedFields = ["itemName", "price"];
  const updateDataItem = {};

  const stock = await Stock.findOne({
    $or: [{ item: id, owner: userId }],
  });

  if (!stock) {
    throw new ApiError(404, "Stock not found for the provided ID! ", false);
  }

  for (const field of allowedFields) {
    if (req.body[field] != undefined) {
      updateDataItem[field] = req.body[field];
    }
  }

  const updateStock = req.body.quantity != undefined;

  const session = await mongoose.startSession();
    session.startTransaction();
  try {
    let updatedItem = null;
    if (Object.keys(updateDataItem).length > 0) {
      updatedItem = await Item.findByIdAndUpdate(
        id,
        { $set: updateDataItem },
        { new: true },
        {session}
      );
    } else {
      updatedItem = await Item.findOne({ _id: id });
    }

    if (!updatedItem) {
      throw new ApiError(404, "Item record not found! ", false);
    }

    let updatedStock = null;
    if (updateStock) {
      updatedStock = await Stock.findByIdAndUpdate(
        stock._id,
        { $set: { quantity: req.body.quantity } },
        { new: true },
        {session}
      );
    } else {
      updatedStock = await Stock.findOne({ item: id, owner: user });
    }

    if (!updatedStock) {
      throw new ApiError(404, "Stock record not found! ", false);
    }

    await session.commitTransaction();

    const response = {
        itemName: updatedItem.itemName,
        price: updatedItem.price,
        quantity: updatedStock.quantity,
    };

    return res.status(200)
    .json(new ApiResponse("Item update successfully! ", 200, response));

  } catch (error) {
    if (session.inTransaction()) {
        await session.abortTransaction();
        return res.status(500).json(new ApiError(500, "Item updation failed ", false))
    }
  }finally{
    await session.endSession();
  }

  
});

//delete item
const deleteItem = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ObjectId",
    });
  }

  const itemId = new mongoose.ObjectId(req.params?.id);

  const itemFound = await Stock.findOne({ item: itemId });

  if (!itemFound) {
    return res
      .status(404)
      .json(new ApiResponse("Stock not found of the required Item! ", 404));
  }

  //inside a session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Item.findByIdAndDelete(itemId, { session });

    await Stock.findByIdAndDelete(itemFound._id, { session });

    await session.commitTransaction();

    return res
      .status(200)
      .json(new ApiResponse("Item and Stock deleted Successfully! ", 200));
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw new ApiError(400, error.message);
  } finally {
    session.endSession();
  }
});

export { addItem, getItems, addCategory, updateItem, deleteItem };
