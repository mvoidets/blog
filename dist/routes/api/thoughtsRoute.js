import { Router } from 'express';
const router = Router();
import { getAllThoughts, getThoughtsById, createThought, updateThought, deleteThought, deleteReaction, addReaction } from '../../controllers/thoughtsController.js';
// /api/Thouthgs
router.route('/')
    .get(getAllThoughts)
    .post(createThought);
// /api/thoughts/:thoughtsId
router
    .route('/:thoughtsId')
    .get(getThoughtsById)
    .delete(deleteThought)
    .put(updateThought);
//api/thoughts/:thoughtId/reactions
router
    .route('/:thoughtId/reactions')
    .post(addReaction);
// /api/thoughts/:thoughtId/reactions/:reactionsId
router
    .route('/:thoughtId/reactions/:reactionsId')
    .delete(deleteReaction);
export { router as thoughtsRouter };
