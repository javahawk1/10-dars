const mongoose = require("mongoose")
const joi = require("joi")

const categorySchema = new mongoose.Schema({
    name: String,
    image: String,
})

const categoryValidation = joi.object({
    name: joi.string().required(),
    image: joi.string()
})

const Category = mongoose.model("Category", categorySchema)

module.exports = { Category, categoryValidation }