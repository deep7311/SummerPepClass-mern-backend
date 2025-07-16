import productModel from "../models/product.model.js";
import cloudinary from "../config/cloudinaryConfig.js";
import sharp from "sharp";


// yaha sare products fetch kar rahe hai hum
export const getAllProducts = async (req, res) => {
  try {
    const {page = 1, limit = 3, search = ""} = req.query
    const skip = (page - 1) * limit
    const count = await productModel.countDocuments({productName: {$regex: search, $options: "i"}})
    const total = Math.ceil(count/limit)
    const products = await productModel.find({productName: {$regex: search, $options: "i"}})
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1})
    res.status(200).json({products, totalPages: total, success: true});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


// yaha admin new products  ko add kar skta hai
export const addProduct = async (req, res) => {
  const MAX_SIZE = 30 * 1024 // 30KB
  try {
    const { productName, description, price } = req.body;

    const imageUrlArray = [];

    for (let file of req.files) {
      let quality = 50;
      let compressedOutputBuffer;

      do {
        compressedOutputBuffer = await sharp(file.buffer)
          .resize({ width: 400 }) // 400 ya usse lower try kar sakte hai size aur kam akrna hai to
          .jpeg({ quality })
          .toBuffer();

        quality -= 5; // yaha size ko aur reduce karne ki try kar raha hu agar size abhi bhi bada hai to
      } while (compressedOutputBuffer.length > MAX_SIZE && quality > 10);

      console.log(
        "Final image size:",
        compressedOutputBuffer.length / 1024,
        "KB"
      );

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "Mern-Project-Ecommerce", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(compressedOutputBuffer);
      });
      imageUrlArray.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const product = await productModel.create({
      productName,
      description,
      price,
      productImage: imageUrlArray,
    });

    res
      .status(201)
      .json({ message: "Product added successfully", product, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong", success: false });
  }
};


// yaha admin products ko update kar skta hai
export const updateProduct = async (req, res) => {
  const MAX_SIZE = 30 * 1024 // 30KB
  try {
    const productId = req.params.id;
    const existingProduct = await productModel.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    const {productName, description, price} = req.body;

    let existingImagesFromClient = req.body.existingImages

    if(existingImagesFromClient && typeof existingImagesFromClient === "string") {
        existingImagesFromClient = [existingImagesFromClient]
    }

    let finalExistingImages = []
    if(existingImagesFromClient?.length > 0) {
        for(let img of existingImagesFromClient) {
            try {
                const parsed = JSON.parse(img)
                finalExistingImages.push(parsed)
            } catch (error) {
                console.log("Image parse error", error)
            }
        }
    }

    const originalImages = existingProduct.productImage

    for(let oldImg of originalImages) {
        const stillExists = finalExistingImages.find(img => img.public_id === oldImg.public_id)
        if(!stillExists) {
            try {
                await cloudinary.uploader.destroy(oldImg.public_id)
            } catch (error) {
                console.log("Failed to delete image from cloudinary: ", error)
            }
        }
    }

    if(req.files?.length > 0) {
        for(let file of req.files) {
            let quality = 50;
            let compressedOutputBuffer;

            do {
              compressedOutputBuffer = await sharp(file.buffer)
                .resize({ width: 400 }) // try 400 or lower for small size
                .jpeg({ quality })
                .toBuffer();

              quality -= 5; // try reducing quality if size still large
            } while (compressedOutputBuffer.length > MAX_SIZE && quality > 10);

            console.log(
              "Final image size:",
              compressedOutputBuffer.length / 1024,
              "KB"
            );

            const uploaded = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "Mern-Project-Ecommerce", resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                uploadStream.end(compressedOutputBuffer);
            })

            finalExistingImages.push({
                url: uploaded.secure_url,
                public_id: uploaded.public_id
            })
        }
    }

    await productModel.findByIdAndUpdate(productId, {
        productName,
        description,
        price,
        productImage: finalExistingImages
    })

    res.status(201).json({message: "Product updated successfully", success: true})
} catch (error) {
    console.log(error)
    res.status(400).json({message: "Something went wrong", success: false})
  }
};


// yaha admin products ko delete kar skta hai
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id

    const product = await productModel.findById(productId)

    if(!product) {
        return res.status(404).json({message: "Product not found", success: false})
    }

    //delete karenge images cloudinary se
    for(let img of product.productImage) {
        if(img.public_id) {
            await cloudinary.uploader.destroy(img.public_id)
        }
    }

    await productModel.findByIdAndDelete(productId)

    res.status(201).json({message: "Product deleted successfully", success: true})
  } catch (error) {
    console.log(error)
    res.status(400).json({message: "Something went wrong", success: false})
  }
};



// ye products hamare main page par dikhenge chahe user login ho ya na ho
export const displayAllProducts = async (req, res) => {
  try {
    const {page = 1, limit = 6, search = ""} = req.query
    const skip = (page - 1) * parseInt(limit)
    const count = await productModel.countDocuments({productName: {$regex: search, $options: "i"}})
    const total = Math.ceil(count/limit)
    const products = await productModel.find({productName: {$regex: search, $options: "i"}})
    .skip(skip)
    .limit(limit)
    res.status(200).json({products, totalPages: total, success: true});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};