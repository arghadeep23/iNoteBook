const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');
router.post('/', body('email','Enter valid email').isEmail(), body('name','Enter valid name(greater than 2 letters)').isLength({ min: 2 }), body('password','Password must be of more than 5 letters').isLength({ min: 5 }), (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({result:result.array()});
    }
    User.create({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email
    }).then(user=>res.json(user)).catch(err=>{console.log(err); res.json({error:'Email already exists'})});
})
module.exports = router