const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")

const { Product, productValidation } = require("../models/product")

const store = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        let nom = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext
        cb(null, nom)
    }
})

const upload = multer({ storage: store })

router.get("/", async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query
        page = Number(page)
        limit = Number(limit)
        let skip = (page - 1) * limit

        let data = await Product.find().populate("category").skip(skip).limit(limit)
        res.send(data)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get("/category/:id", async (req, res) => {
    try {
        let data = await Product.find({ category: req.params.id })
        res.send(data)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post("/", upload.single("image"), async (req, res) => {
    try {
        let { error, value } = productValidation.validate(req.body)
        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        }
        let data = await Product.create({...value, image: req.file.filename})
        res.send(data)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch("/:id", async (req, res) => {
    try {
        let { error, value } = productValidation.validate(req.body)

        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        }

        let data = await Product.findByIdAndUpdate(req.params.id, value, { new: true })
        res.send(data)

    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete("/:id", async (req, res) => {
    try {
        let data = await Product.findByIdAndDelete(req.params.id)
        if (data) {
            res.send("deleted")
        } else {
            res.status(400).send("invalid id")
        }
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router
