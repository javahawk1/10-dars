const mongoose = require("mongoose")
const joi = require("joi")

const userSchema = new mongoose.Schema({
    login: String,
    parol: String,
    image: String,
})

const userValidation = joi.object({
    login: joi.string().required(),
    parol: joi.string().min(6).required(),
    image: joi.string()
})

const User = mongoose.model("User", userSchema)

module.exports = { User, userValidation }

