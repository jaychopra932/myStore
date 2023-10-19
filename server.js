var express = require("express");
let axios = require("axios");
let cookieParser = require("cookie-parser");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, , authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  next();
});
app.use(cookieParser());
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let { products, orders, users } = require("./data.js");

app.post("/login", function (req, res) {
  let body = req.body;
  let { email = "", password = "" } = body;
  let user = users.find((a) => a.email === email && a.password === password);
  user ? res.cookie("userData", user) : "";
  user
    ? res.send(user)
    : res.status(401).send("Login Failed . Please Check Email or Password");
});

app.post("/register", function (req, res) {
  let body = req.body;
  users.push(body);
  res.send("User Registered ");
});

app.get("/products/:id", function (req, res) {
  let id = req.params.id;
  let product = products.find((a) => a.id == id);
  res.send(product);
});

app.get("/products", function (req, res) {
  let { category = "" } = req.query;
  let filteredproducts = category
    ? products.filter((a) => a.category === category)
    : products;
  res.send(filteredproducts);
});

app.post("/products", function (req, res) {
  let body = req.body;
  let id = products.reduce((a, c) => (c.id > a ? (a = c.id) : a), 0);
  let json = { id: id + 1, ...body };
  products.push(json);
  res.send(json);
});
app.put("/products/:id", function (req, res) {
  let id = req.params.id;
  let body = req.body;
  let index = products.findIndex((a) => a.id == id);
  products[index] = body;
  res.send(body);
});

app.delete("/products/:id", function (req, res) {
  let id = req.params.id;
  let body = req.body;
  let index = products.findIndex((a) => a.id == id);
  products.splice(index, 1);
  res.send(body);
});

app.get("/orders/:email", function (req, res) {
  let email = req.params.email;
  let arr = orders.filter((a) => a.email == email);
  res.send(orders);
});

app.post("/orders", function (req, res) {
  let data = req.cookies.userData;
  let body = req.body;
  let json = { ...data, ...body };
  orders.push(json);
  res.send(json);
});
