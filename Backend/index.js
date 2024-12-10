const express = require("express");
const app = express();
const PORT = 4000;
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cors = require("cors");
// const path=require ("path");
const multer =require("multer");

// Import routes
const userRoutes = require("./User/routes/user");
const productRoutes = require("./Admin/routes/product");

app.use(express.json());
app.use(cors());

// Use routes
app.use("/user", userRoutes);
app.use("/product", productRoutes);


mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Listening on PORT ${PORT}`);
      }
    });
  });
