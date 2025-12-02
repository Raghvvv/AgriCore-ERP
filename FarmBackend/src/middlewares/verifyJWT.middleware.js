import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { reGenerateTokens } from "../controllers/user.controller.js";

const verifyJWT = asyncHandler(async(req,res, next)=>{
    //fetch the token from cookies or header object
    const accessToken = req.cookies?.accessToken; 
    const refreshToken = req.cookies?.refreshToken;

     console.log("Hello");
  
  console.log("Cookie domain: ", process.env.COOKIE_DOMAIN, typeof(process.env.COOKIE_DOMAIN));
  console.log("Current User: ", req.user)
    

    //throw error if no token is availabe
    //user is not authenticated
    if (!accessToken || accessToken === "undefined" || accessToken === "null") {
        throw new ApiError(401, "User is not authenticated ", false)
    }
    
    console.log(process.env.COOKIE_DOMAIN);
    
    //cookie options configure
    const options = {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.COOKIE_SECURE === "false",
        // sameSite: process.env.COOKIE_SAMESITE, // "None" | "Lax" | "Strict"
        // domain: process.env.COOKIE_DOMAIN || undefined, // frontend domain
        // maxAge: Number(process.env.COOKIE_MAX_AGE), // convert string to number
        // path: process.env.COOKIE_PATH || "/",
    };

    try {
        //verify the access token fetched from above
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, options);
        
        //fetch the user details using the id in the decodedToken object
        const user = await User.findById(decodedToken._id)?.select("-password -refreshToken");

        if (!user) {
            throw new ApiError(403, "Invalid User Token", false);
        }

        //inject the user into the req object
        req.user = user;
        //exits the middleware
        return next(); 
    } catch (error) {
        if (error.name !== 'TokenExpiredError' && error.name !== 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid Access Token' });
        }
    }

    //if the error is tokenExpire 
    //check for the refresh token and regenerate tokens if available
    if (refreshToken && refreshToken !== "undefined") {
        const refreshResult = await reGenerateTokens(req, res);

        //if no refresh token then throw error response
        if (!refreshResult?.success) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(401).json({ message: "Session expired — login required" });
        }

        //send the user in the request
        req.user = refreshResult.user;
        return next();
    }
    else{
        throw new ApiError(401, "Refresh Token invalid", false)
    }
})

export {verifyJWT};