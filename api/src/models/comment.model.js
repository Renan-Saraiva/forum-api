module.exports = mongoose => {
    var commentSchema = mongoose.Schema({
        text: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        createdOn: {
            type: Date,
            default: Date.now
        }
    });

    commentSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    // Export comment model
    return mongoose.model('comment', commentSchema);    
};