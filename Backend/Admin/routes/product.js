
const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const multer = require('multer');
const path = require('path');



//Image Storage Engine

const storage = multer.diskStorage({
  destination : './upload/images',
  filename:(req,file,cb)=>{
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({storage:storage})

router.use('/images',express.static('upload/images'))

//Creating upload endpoint for images
router.post("/upload",upload.single('product'),(req,res)=>{
  res.json({
    success:1,

    image:`http://localhost:4000/images/${req.file.filename}`

  })
}) 

// Endpoint to add a new product


router.post('/addproduct', async (req, res) => {
  try {

    // let products =await Product.find({});

    // Log the incoming request body for debugging 
    console.log("Received request body:", req.body);

    const { id, name, category, image, new_price, old_price } = req.body;
    if (!id || !name || !category || !image || !new_price || !old_price) {
      console.log("Validation failed: Missing fields", { id, name, category, image, new_price, old_price });
      return res.status(400).json({errors: "Please provide all required fields" });
    }
    const newProduct = await Product.create({ id , name, category, image, new_price, old_price });


    const newProduct = await Product.create({ id, name, category, image, new_price, old_price });
    res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });  
  } catch (error) {

    
    console.error("Error adding product:", error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
});


// Endpoint to get all products 
router.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } 
  catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
});

// Endpoint to get a single product by ID 
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ errors: "Product not found" });
    }
    res.status(200).json(product);
  } 
  catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
});



router.patch('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ errors: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } 
  catch (error) {
    console.error("Error partially updating product:", error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
});

// Endpoint to delete a product by ID (Delete)
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ errors: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } 
  catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
});

module.exports = router;

