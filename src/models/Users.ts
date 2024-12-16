import { Schema, model, type Document } from 'mongoose';

interface IUser extends Document {
    username: String;
    email: String;
    thoughts: Schema.Types.ObjectId[];
    friends: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
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
},    {
        toJSON: {
            getters: true,
        },
        timestamps: true
    }
);

userSchema.virtual('friendCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'friends',
    count: true
});

const User = model<IUser>('User', userSchema);

export default User;
