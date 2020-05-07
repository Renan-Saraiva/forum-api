const comments = require("../controllers/comment.controller");
var router = require("express").Router();

// Create a new Comment
router.post("/", comments.create);
// Retrieve all Comment
router.get("/", comments.all);
// Retrieve a single Comment with id
router.get("/:id", comments.findOne);
// Retrieve all answers
router.get("/:id/answers", comments.all); //todo
// Update a Comment with id
router.put("/:id", comments.update);
// Delete a Comment with id
router.delete("/:id", comments.delete);  

module.exports = router;