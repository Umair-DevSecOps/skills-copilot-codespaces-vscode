// Create web server

// Import express
const express = require('express');
const router = express.Router();

// Import model
const Comment = require('../models/comment');

// Import middleware
const { requireSignin, userMiddleware } = require('../common-middleware');

// Create new comment
router.post('/comment/create', requireSignin, userMiddleware, (req, res) => {
    const { comment, postId } = req.body;
    const userId = req.user._id;
    const newComment = new Comment({
        userId,
        postId,
        comment
    });
    newComment.save((error, comment) => {
        if (error) return res.status(400).json({ error });
        if (comment) return res.status(201).json({ comment });
    });
});

// Get comments by post id
router.get('/comments/:postId', requireSignin, userMiddleware, (req, res) => {
    const { postId } = req.params;
    Comment.find({ postId })
        .populate('userId', '_id firstName lastName')
        .exec((error, comments) => {
            if (error) return res.status(400).json({ error });
            if (comments) return res.status(200).json({ comments });
        });
});

// Export router
module.exports = router;