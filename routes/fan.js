const express = require('express');
const router = express.Router();
const Fan = require('../models/fan');


// Get all posts
router.get('/', async (req, res) => {
    try {
        const fans = await Fan.find()
        res.json(fans)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// Create one post
router.post('/', async (req, res) => {
    const fan = new Fan({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    })
    try {
        const newFan = await fan.save()
        res.status(201).json(newFan)
      } catch (err) {
        res.status(400).json({ message: err.message })
      }
})




// Update one post
router.patch('/:id', (req, res) => {
})

// Delete one post
router.delete('/:id', (req, res) => {
})



module.exports = router;
