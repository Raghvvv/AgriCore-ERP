import { Stock } from "../models/Stock.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

const updateStock = asyncHandler(async(itemId, userId, quantity)=>{
    const updatedItem = await Stock.findByIdAndUpdate({item:itemId, owner:userId},
        {$set : {quantity:quantity}},
        {new:true}
    )

    if (!updatedItem) {
        throw new ApiError(500, "Stock updation failed! Try Again ", false)
    }

    return updatedItem;
})

export {updateStock};