import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thoughts' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    toJSON: {
        getters: true,
    },
    timestamps: true
});
userSchema.virtual('friendCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'friends',
    count: true
});
const User = model('User', userSchema);
export default User;
