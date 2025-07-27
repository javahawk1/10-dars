const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const User = require("./routes/user")
const Category = require("./routes/category")
const Product = require("./routes/product")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://djakhadeveloper:xVs12dSBVVVe81iW@cluster0.ybn1d49.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err))

app.use("/users", User)
app.use("/category", Category)
app.use("/products", Product)

app.listen(3000, () => {
    console.log("Server started")
})