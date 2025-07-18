import express from "express";
import { addProduct, deleteProduct, displayAllProducts, getAllProducts, updateProduct, viewSingleProduct } from "../controllers/product.controller.js";
import upload from "../config/multer.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/all-products", displayAllProducts);
productRouter.post("/add-product", upload.array("productImages", 4), addProduct);
productRouter.put("/update-product/:id", upload.array("productImages", 4), updateProduct);
productRouter.delete("/:id", deleteProduct);

productRouter.get("/product/:id", viewSingleProduct)

export default productRouter;