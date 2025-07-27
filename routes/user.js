const express = require("express")
const multer = require("multer")
const path = require("path")

const { User, userValidation } = require("../models/user")

const router = express.Router()

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
        const data = await User.find()
        res.send(data)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post("/register", upload.single("image"), async (req, res) => {
    try {
        const { error, value } = userValidation.validate(req.body)

        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        }


        let isRegistered = await User.find({ login: value.login })

        if (isRegistered.length > 0) {
            return res.status(400).send("this login is already registered")
        }

        let data = await User.create({ ...value, image: req.file.filename })
        res.status(201).send(data)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post("/login", async (req, res) => {
    try {
        let isRegistered = await User.find(req.body)

        if (isRegistered.length > 0) {
            res.send(isRegistered)
        } else {
            res.status(400).send("unregistered or wrong password")
        }
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch("/:id", async (req, res) => {
    try {
        let { error, value } = userValidation.validate(req.body)

        if (error) {
            return res.status(400).send("invalid")
        }

        let data = await User.findByIdAndUpdate(req.params.id, value, { new: true })
        res.send(data)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete("/:id", async (req, res) => {
    try {
        let data = await User.findByIdAndDelete(req.params.id)

        if (data) {
            res.send("Deleted")
        } else {
            res.status(400).send("wrong id")
        }
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router
