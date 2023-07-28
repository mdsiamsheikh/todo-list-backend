const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create product schema
const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create product model
const product = mongoose.model("Products", productsSchema);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductsDB");
    console.log("db is connected");
  } catch (error) {
    console.log("db is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
  await connectDB();
});

app.get("/", (req, res) => {
  res.send("welcome to home page");
});

app.post("/products", async (req, res) => {
  try {
    // get data from request body
    const newProduct = new product({
      title: req.body.title,
      price: req.body.price,
      rating: req.body.rating,
      description: req.body.description,
    });
    const productData = await newProduct.save();
    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const price = req.query.price;
    let products;
    if (price) {
      products = await product.find({ price: { $gt: price } });
    } else {
      products = await product.find();
    }

    if (products) {
      res.status(200).send({
        success: true,
        message: "return all products",
        data: products,
      });
    } else {
      es.status(404).send({
        success: false,
        message: "products not found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await product.findOne({ _id: id });
    if (product) {
      res.status(200).send({
        success: true,
        message: "return single product",
        data: product,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "product was not found with this id found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete({ _id: id });
    if (product) {
      res.status(200).send({
        success: true,
        message: "deleted single product",
        data: product,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "product was not deleted with this id ",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = await product.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          rating: req.body.rating,
        },
      },
      { new: true }
    );
    if (updatedProduct) {
      res.status(200).send({
        success: true,
        message: "updated single product",
        data: updatedProduct,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "product was not updated with this id found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
