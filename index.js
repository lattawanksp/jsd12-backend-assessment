import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const products = [
  { id: "1", name: "Keyboard", price: 49.99, quantity: 1 },
  { id: "2", name: "Mouse", price: 24.99, quantity: 2 },
];

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const foundProduct = products.find((product) => product.id === productId);

  if (!foundProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(foundProduct);
});

app.post("/products", (req, res) => {
  const { name, price, quantity } = req.body;

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

app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;

  const productIndex = products.findIndex(
    (product) => product.id === productId,
  );

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = products.splice(productIndex, 1);

  res.json({
    message: "Product deleted successfully",
    deletedProduct,
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} ✅`);
});
