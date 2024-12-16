import { Schema, model, Types, type Document } from 'mongoose';

interface IThought extends Document {
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [typeof reactionSchema],
}

interface IReaction extends Document {
    reactionId: {
        type: String,
        required: true,
        max_length: 50,
    },
    reactionBody: {
        type: String,
        required: true,
        max_length: 280,
    },
    username: {
        type: String,
        required: true,
        max_length: 50,
    },
}

const reactionSchema = new Schema<IReaction>({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        max_length: 280,
    },
    username: {
        type: String,
        required: true,
        max_length: 50,
    },
}, {
    toJSON: {
        getters: true,
    },
    timestamps: true,
});

const thoughtSchema = new Schema<IThought>({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    timestamps: true,
    id: false,
});

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});


const Thoughts = model('Thought', thoughtSchema);
//const Reaction = model('Reaction', reactionSchema);

export { Thoughts };
