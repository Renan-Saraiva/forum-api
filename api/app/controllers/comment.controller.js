const db = require("../models");
const { body, validationResult } = require('express-validator')

const Comment = db.comments;

exports.validate = () => {
    return [
        body('user', 'user field is required').notEmpty(),
        body('user', 'user invalid type').isString(),
        body('text', 'text field is required').notEmpty(),
        body('text', 'text invalid type').isString()
    ];
}

// Create and Save a new Comment
exports.create = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    // Create a Tutorial
    const comment = new Comment(req.body);

    // Save Tutorial in the database
    comment
        .save(comment)
        .then(createdComment => {
            res.send(createdComment);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the comment."
            });
        });
};

// Retrieve all Comments from the database.
exports.all = (req, res) => {
    const all = {}

    Comment.find(all)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving comments."
            });
        });
};

// Find a single Comment with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Comment.findById(id)
        .then(data => {
            if (data)
                res.send(data);
            else
                res.status(404)
                    .send({ message: "Comment not found" });

        })
        .catch(err => {
            res.status(500)
                .send({ message: "Error retrieving comment" });
        });
};

// Update a Comment by the id in the request
exports.update = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    const id = req.params.id;

    Comment.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (data)
                res.send({ message: "Comment was updated successfully." });
            else {
                res.status(404).send({
                    message: `Cannot update Comment with id=${id}. Maybe Comment was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Comment with id=" + id
            });
        });
};

// Delete a Comment with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Comment.findByIdAndRemove(id)
        .then(data => {
            if (data)
                res.send({ message: "Comment was deleted successfully!" });
            else {
                res.status(404).send({
                    message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Comment with id=" + id
            });
        });
};

// Create a reply and related a one comment
exports.createReply = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const id = req.params.id;

    Comment.findById(id)
        .then(comment => {
            if (comment) {
                // Create a reply
                const reply = new Comment(req.body);

                // Save reply in the database
                reply
                    .save(reply)
                    .then(createdReply => {
                        comment.addReply(createdReply)
                            .then(() => {
                                res.send(createdReply);
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message: err.message || "Some error occurred while set reply to comment."
                                });
                            });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the reply."
                        });
                    });
            }
            else
                res.status(404)
                    .send({ message: "Comment not found" });
        })
        .catch(err => {
            res.status(500)
                .send({ message: "Error retrieving comment" });
        });
};

// Get all replies
exports.replies = (req, res) => {
    const id = req.params.id;

    Comment.findById(id)
        .populate('replies')
        .then(data => {
            if (data)
                res.send(data.replies);
            else
                res.status(404)
                    .send({ message: "Comment not found" });

        })
        .catch(err => {
            res.status(500)
                .send({ message: "Error retrieving comment" });
        });
};