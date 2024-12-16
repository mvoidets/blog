import { Router } from 'express';
const router = Router();
import {
  getAllUser,
  getUserById,
  createUser,
  deleteUser,
  addFriend,
  removeFriend,
  updateUser
} from '../../controllers/userControllers.js';

// /api/users
router.route('/')
.get(getAllUser)
.post(createUser)


// /api/users:UserId
router
.route('/:UserId')
.get(getUserById)
.delete(deleteUser)
.put(updateUser);

// /api/users/:userId/friends
router
.route('/:userId/friends/:friendId')
.post(addFriend)
.delete(removeFriend)
.get(getUserById);


// /api/users/:freindID/friends/:friendID
router
.route('/:userId/friends/:friendId')
.delete(removeFriend);




export { router as userRouter} ;
