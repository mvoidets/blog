// ObjectId() method for converting studentId string into an ObjectId for querying database
import { Users, Thoughts } from '../models/index.js';
//import { Types } from 'mongoose';
export const getAllUser = async (_, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
export const getUserById = async (req, res) => {
    console.log("User ID: ", req.params.UserId);
    const { UserId } = req.params;
    try {
        const user = await Users.findById(UserId);
        if (user) {
            res.json({
                user
            });
        }
        else {
            res.status(404).json({
                message: 'User not found'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
export const createUser = async (req, res) => {
    try {
        const user = await Users.create(req.body);
        res.json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
export const deleteUser = async (req, res) => {
    const { UserId } = req.params;
    try {
        const user = await Users.findOneAndDelete({ _id: UserId });
        console.log("Data from delete user", req.params);
        if (!user) {
            return res.status(404).json({ message: 'No such user exists' });
        }
        const thought = await Thoughts.findOneAndUpdate({ user: req.params.userId }, { $pull: { user: req.params.userId } }, { new: true });
        if (!thought) {
            return res.status(404).json({
                message: 'User deleted, but no thought found',
            });
        }
        return res.json({ message: 'User successfully deleted' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
export const addFriend = async (req, res) => {
    console.log("Incoming request to add friend", req.params); // userId: '', firendID: undeinfed
    try {
        const friend = await Users.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { runValidators: true, new: true });
        return res.json({ message: 'Friend added!', friend });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
export const removeFriend = async (req, res) => {
    try {
        const user = await Users.findOneAndDelete({ _id: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'No such friend exists' });
        }
        await Users.findOneAndUpdate({ users: req.params.userId }, { $pull: { users: req.params.userId } }, { new: true });
        return res.json({ message: 'Friend successfully deleted' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
export const updateUser = async (req, res) => {
    try {
        const user = await Users.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true });
        if (!user) {
            res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
