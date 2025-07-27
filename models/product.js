const mongoose = require("mongoose")
const joi = require("joi")

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    }
})

const productValidation = joi.object({
    name: joi.string().required(),
    price: joi.number().min(0).required(),
    category: joi.string()
})

const Product = mongoose.model("Product", productSchema)

module.exports = {Product, productValidation}
