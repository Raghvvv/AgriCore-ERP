import { ApiError } from "./ApiError.js";

//wrapper async function with try and catch
//high order function
const asyncHandler = (func) => async(req,res,next) => {
    try {
        await func(req,res,next);
    } catch (error) {
          if (error.code === 11000) {
            const fieldName = Object.keys(err.keyValue)[0];
            return res.status(400).json({
            success: false,
            message: `${fieldName} already exists`,
        });
    }
  
        return res.status(error.statusCode || 500).json({
            success: false,
            message:error.message,
        })
    }
}

export default asyncHandler;