var commentValidator = {
    isValid: (req, res) => {
        const invalidModelErrors = [];
        const comment = commentValidator.getComment(req);

        if (!comment) {
            invalidModelErrors.push(commentValidator.createErrorObject("Data can not be empty"));
            return invalidModelErrors;
        }
    
        if (!comment.text)
            invalidModelErrors.push(commentValidator.createErrorObject("Text can not be empty!"));
    
        if (!comment.user)
            invalidModelErrors.push(commentValidator.createErrorObject("User can not be empty!"));
    
        if (invalidModelErrors.length > 0) {
            res.status(400).send(invalidModelErrors);
            return false;
        }

        return true;
    },
    getComment: (req) => req.body,
    createErrorObject: (message) => { return { message } }
};

module.exports = commentValidator;