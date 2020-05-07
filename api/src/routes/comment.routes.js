const comments = require("../controllers/comment.controller");
var router = require("express").Router();

// Create a new Comment
router.post("/", comments.create);
// Retrieve all Comment
router.get("/", comments.all);
// Retrieve a single Comment with id
router.get("/:id", comments.findOne);
// Update a Comment with id
router.put("/:id", comments.update);
// Delete a Comment with id
router.delete("/:id", comments.delete);  

// Retrieve all replies
router.get("/:id/replies", comments.replies);
// Retrieve all replies
router.post("/:id/replies", comments.createReply);

module.exports = router;