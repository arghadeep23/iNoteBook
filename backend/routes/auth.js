const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt=require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRET="Ilikeprocrastination";
// create a user using post "api/auth/createuser", no login required
router.post(
    "/createuser",
    body("email", "Enter valid email").isEmail(),
    body("name", "Enter valid name(greater than 2 letters)").isLength({ min: 2 }),
    body("password", "Password must be of more than 5 letters").isLength({
        min: 5,
    }),
    async (req, res) => {
        // if there are errors, return bad request and errors
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ result: result.array() });
        }
        let user = await User.findOne({ email: req.body.email });
        if (user)
            res
                .status(400)
                .json({ error: "An account with this email already exists" });
        else {
            const salt=bcrypt.genSaltSync(10); // generating a salt of 10 rounds
            const secPass=await bcrypt.hashSync(req.body.password,salt); // hasing the password
            // create a new user
            user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email,
            })
                .then((user) => {
                    const data={
                        user:{
                            id:user.id
                        }
                    }
                    const token=jwt.sign(data,JWT_SECRET);
                    res.json({authtoken:token})
                })
                // catching errors
                .catch((err) => {
                    console.log(err);
                    res.json({ error: "Email already exists" });
                });
        }
    }
);
module.exports = router;
