import mongoose from "mongoose";
import { Crop } from "../models/Crop.model.js";
import { Stock } from "../models/Stock.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Item } from "../models/Item.model.js";


const addCrop = asyncHandler(async(req, res)=>{
    //fetch the user data and validate
    //check for enough quantity of an item in stock table
    //then create a session
    //create crop entry
    //update the stock entry
 
    const{cropName, plantingDate, harvestingDate, usedItems} = req.body;

    if ([cropName, plantingDate, harvestingDate, usedItems].some((field) => field?.trim === "")) {
        //custom error
        throw new ApiError(400, "All fields are required", false);
    }

    const user = req.user?._id;

    if (!usedItems || Object.keys(usedItems).length == 0
    ) {
        throw new ApiError(400, "Items are required", false);
        
    }
    
    //fetch stock for the items used
    for(const item of usedItems){
        const itemId = new mongoose.Types.ObjectId(item.itemId)
        
        const fetchedStock = await Stock.findOne({item:itemId})

        if (!fetchedStock) {
            throw new ApiError(404, "No stock for the given item! ", false);
        }

        if(fetchedStock.quantity < item.quantity){
            throw new ApiError(400,"Not enough quanitity for the given item", false)
        }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cropEntry = await Crop.create([{
            cropName,
            plantingDate, 
            harvestingDate,
            owner:req.user?._id,
            itemUsed:usedItems
        }],
        {session} 
        )

        for (let u of usedItems) {
            await Stock.updateOne(
            { item: u.itemId, owner:req.user?._id },
            { $inc: { quantity: -u.quantity} },
            { session }
        );
    }

    await session.commitTransaction();

    res.status(200)
    .json(new ApiResponse("Crop creating successfull! ",200, cropEntry))

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw new ApiError(400, error.message);
    }finally{
        session.endSession();
    }

})

const getCrops = asyncHandler(async(req, res)=>{
    const userId = req.user?._id;

    console.log(userId);
    
    const cropsData = await Crop.find({owner:userId});

    if (!cropsData) {
        throw new ApiError(500, "No crop of the user ",false)
    }

    return res.status(200).json(new ApiResponse("Crops data retreival successfull", 200, cropsData));
})

const updateCrop = asyncHandler(async(req, res)=>{
    //get the actual yield
    //update the crop status to harvested 
    //update the stock with yield produced

    const{actualYield,price, category} = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ObjectId",
        });
      }

    const categoryId = new mongoose.Types.ObjectId(category);
    const cropId = new mongoose.Types.ObjectId(req.params?.id);

    if (!actualYield || !price || !category) {
        throw new ApiError(400, "All fields are required ", false);
    }

    const userId = req.user?._id;

    //creating session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //updating the crop data with actual yield and status
        const cropData = await Crop.findByIdAndUpdate(cropId,
        {$set:{status:"Harvested",
            actualYield:actualYield,
        }},
        {new:true},
        {session}
    )

    //validating the cropData
    if (!cropData) {
        throw new ApiError(500, "Crop updation failed, try again! ", false);
    }

    //creating crop item
    const cropItem = await Item.create({
        itemName:cropData.cropName,
        category:categoryId,
        owner:userId,
        price:price,
        category:categoryId
    })

    if (!cropItem) {
        throw new ApiError(500, "Crop updation failed, try again! ", false);
    }

    const cropStock = await Stock.create({
        item: cropItem._id,
        owner:userId,
        quantity:actualYield,
    })

    if (!cropStock) {
        throw new ApiError(500, "Crop updation failed, try again! ", false);
    }

    await session.commitTransaction()
    
    return res.status(200)
    .json(new ApiResponse("Crop updation successFull ", 200, cropData));
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction()
            throw new ApiError(500,error.message , false)
        }
    }
    finally{
        await session.endSession();
    }

})
    
    

export{addCrop, getCrops, updateCrop};