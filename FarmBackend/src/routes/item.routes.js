import { Router } from "express";
import { addCategory, addItem } from "../controllers/item.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { getItems } from "../controllers/item.controller.js";
import { updateItem } from "../controllers/item.controller.js";
import { deleteItem } from "../controllers/item.controller.js";
import { addCrop, getCrops, updateCrop } from "../controllers/crop.controller.js";

const router = Router();

router.route("/addCategory").post(verifyJWT, addCategory)

router.route("/addItem").post(verifyJWT, addItem);

router.route("/getItems").get(verifyJWT, getItems);

router.route("/updateItem/:id").patch(verifyJWT, updateItem);

router.route("/delete/:id").delete(verifyJWT, deleteItem);

router.route("/addCategory").post(verifyJWT, addCategory);

//crop controllers
router.route("/addCrop").post(verifyJWT, addCrop);

router.route("/getCrops").get(verifyJWT, getCrops);

router.route("/updateCrop/:id").patch(verifyJWT,updateCrop);

export{router};