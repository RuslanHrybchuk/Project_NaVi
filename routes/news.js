const express = require('express');
const router = express.Router();
const Schema = require('../models/news');


// Get all posts
router.get('/', async (req, res) => {
    try {
        const news = await Schema.find()
        res.json(news)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// Create one post
router.post('/', async (req, res) => {
    const newsTopic = new Schema({
        name: req.body.name,
        subject: req.body.subject,
        message: req.body.message
    })
    try {
        const newNews = await newsTopic.save()
        res.status(201).json(newNews)
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
