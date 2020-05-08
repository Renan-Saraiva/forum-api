module.exports = app => {

    // simple route
    app.get("/", (req, res) => {
        res.json({ message: "Welcome to forum api." });
    });

    const commentsRouter = require("./comment.routes");
    
    app.use('/api/comments', commentsRouter);
};