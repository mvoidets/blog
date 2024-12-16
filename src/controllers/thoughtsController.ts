import { Request, Response } from 'express';
import { Thoughts, Users } from '../models/index.js';
//import User from '../models/Users.js';

/**
 * GET All Thoughts /Thoughts
 * @returns an array of Thoughts
*/
export const getAllThoughts = async(_req: Request, res: Response) => {
    try {
        const thoughts = await Thoughts.find();
        res.json(thoughts);
    } catch(error: any){
        res.status(500).json({
            message: error.message
        });
    }
}

export const addThought = async (req: Request, res: Response) => {
  console.log('You are adding an thought');
  console.log(req.body);
  try {
      const user = await Users.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { thoughts: req.body } },
          { runValidators: true, new: true }
      );

      if (!user) {
          return res
              .status(404)
              .json({ message: 'No user found with that ID :(' });
      }

      return res.json(user);
  } catch (err) {
      return res.status(500).json(err);
  }
}

export const getThoughtsById = async (req: Request, res: Response) => {
  console.log("Thought ID: ", req.params.thoughtId);
  const { thoughtsId } = req.params;
  try {
      const user = await Thoughts.findById(thoughtsId);
      if (user) {
          res.json({thoughts: user});
      } else {
          res.status(404).json({
              message: 'Thought not found'
          });
      }
  } catch (error: any) {
      res.status(500).json({
          message: error.message
      });
  }
  }


export const createThought = async (req: Request, res: Response) => {
  console.log("Incoming Data: ", req.body);
    const { thoughts } = req.body;
    console.log("Thoughts: ", thoughts);
    try {
      const newThoughts = await Thoughts.create(req.body);
    //  const newThoughts = await Thoughts.create({ thoughtText: req.body.thoughtText, username: req.body.username });
      console.log("New Thought: ", newThoughts);

      // We should Create our ASSOCIATION 
      const updatedUser = await Users.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: newThoughts._id } },
        { new: true }
      );

      res.status(201).json(updatedUser);
    } catch (error: any) {
      console.log("Err: ", error);
      res.status(400).json({
        message: error.message
      });
    }
  };


export const updateThought = async (req: Request, res: Response) => {
  console.log("Incoming Thought Data: ", req.body);
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtsId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought)
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };
 
export const deleteThought = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;
    try {
      const thoughts = await Thoughts.findOneAndDelete({ _id: thoughtId});
      console.log("Data from delete thought", req.params);
      if(!thoughts) {
        res.status(404).json({
          message: 'No thought with that ID'
        });
      } else {
        await Users.deleteMany({ _id: { $in: thoughts.username } });
       
        res.json({ message: 'Thought deleted!' });
      }
      
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };


export const addReaction = async (req: Request, res: Response) => {
  console.log('You are adding an reaction', req.body);
  console.log(req.params);
  try {
      const reaction = await Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
      );

      if(!reaction) {
          return res.status(404).json({ message: 'No thought found with that ID :(' });
      }
      console.log("Created Reaction: ", reaction);
// console.log("ReactionID: ", req.params.reactionId);
return res.json({ message: 'Reaction added!', reaction });
} catch (err) {
    console.log(err);
    return res.status(500).json(err);
}
}



export const deleteReaction = async (req: Request, res: Response) => {
  try {
      const reaction = await Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { new: true }
      );
      console.log("Data from delete reaction", req.params);
      if (!reaction) {
          return res.status(404).json({ message: 'No such reaction exists' });
      }

      return res.json({ message: 'Reaction successfully deleted' });
  } catch (err) {
      console.log(err);
      return res.status(500).json(err);
  }
}