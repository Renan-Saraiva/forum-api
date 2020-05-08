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
        replies: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'comment'
        }]
    }, {timestamps: true});

    commentSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    commentSchema.method("addReply", function(reply) {
        this.replies.push(reply);
        return this.save();        
    });


    // Export comment model
    return mongoose.model('comment', commentSchema);    
};