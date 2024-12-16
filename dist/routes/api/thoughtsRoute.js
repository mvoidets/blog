import { Router } from 'express';
const router = Router();
import { getAllThoughts, getThoughtsById, createThought, updateThought, deleteThought, deleteReaction, addReaction } from '../../controllers/thoughtsController.js';
// /api/Thouthgs
router.route('/')
    .get(getAllThoughts)
    .post(createThought)
    .delete(deleteThought);
// /api/thoughts/:thoughtsId
router
    .route('/:thoughtsId')
    .get(getThoughtsById)
    .delete(deleteThought)
    .put(updateThought);
// reactions
//api/thoughts/:thoughtId/reactions
router
    .route('/:thoughtId/reactions')
    .post(addReaction);
// /api/thoughts/:thoughtId/reactions/:reactionsId
router
    .route('/:thoughtId/reactions/:reactionsId')
    .delete(deleteReaction);
export { router as thoughtsRouter };
