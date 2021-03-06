const comments = require("../controllers/comment.controller");
var router = require("express").Router();

// Create a new Comment
router.post("/", comments.validate(), comments.create);

// Retrieve all Comment
router.get("/", comments.all);
// Retrieve a single Comment with id
router.get("/:id", comments.findOne);
// Update a Comment with id
router.put("/:id", comments.validate(), comments.update);
// Add a like to Comment
router.put("/:id/like",  comments.like);
// Delete a Comment with id
router.delete("/:id", comments.delete);  
// Retrieve all replies
router.get("/:id/replies", comments.replies);
// Post a replies
router.post("/:id/replies", comments.validate(), comments.createReply);

module.exports = router;