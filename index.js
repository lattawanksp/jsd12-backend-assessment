import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const products = [
  { id: "1", name: "Keyboard", price: 49.99, quantity: 1 },
  { id: "2", name: "Mouse", price: 24.99, quantity: 2 },
];

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/products", (req, res) => {
  const productName = req.query.name;

  if (productName) {
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(productName.toLowerCase()),
    );

    return res.json(filteredProducts);
  }

  res.json(products);
});

app.get("/products/:id", (req, res, next) => {
  const productId = req.params.id;
  const foundProduct = products.find((product) => product.id === productId);

  if (!foundProduct) {
    const error = new Error("Product not found");
    error.status = 404;
    return next(error);
  }

  res.json(foundProduct);
});

app.post("/products", (req, res) => {
  const { name, price, quantity = 1 } = req.body;

  if (!name || typeof price !== "number" || typeof quantity !== "number") {
    return res.status(400).json({ message: "Invalid product data" });
  }

  const newProduct = {
    id: String(products.length + 1),
    name,
    price,
    quantity,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

app.patch("/products/:id", (req, res) => {
  const productId = req.params.id;
  const foundProduct = products.find((product) => product.id === productId);

  if (!foundProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, price, quantity } = req.body;

  if (name === undefined && price === undefined && quantity === undefined) {
    return res.status(400).json({ message: "No data provided for update" });
  }

  if (name !== undefined && !name) {
    return res.status(400).json({ message: "Invalid name" });
  }

  if (price !== undefined && typeof price !== "number") {
    return res.status(400).json({ message: "Invalid price" });
  }

  if (quantity !== undefined && typeof quantity !== "number") {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  if (name !== undefined) {
    foundProduct.name = name;
  }

  if (price !== undefined) {
    foundProduct.price = price;
  }

  if (quantity !== undefined) {
    foundProduct.quantity = quantity;
  }

  res.json(foundProduct);
});

app.delete("/products/:id", (req, res, next) => {
  const productId = req.params.id;

  const productIndex = products.findIndex(
    (product) => product.id === productId,
  );

  if (productIndex === -1) {
    const error = new Error("Product not found");
    error.status = 404;
    return next(error);
  }

  const deletedProduct = products.splice(productIndex, 1);

  res.json({
    message: "Product deleted successfully",
    deletedProduct,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} ✅`);
});
