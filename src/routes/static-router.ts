import express from "express";
import { validateRequestSchema } from "../middleware/validateRequestSchema";
import checkParameters from '../helpers/parametersSchema';
import staticController from "../controllers/static-controller";

const router = express.Router();

router.get('/image/:filename', checkParameters, validateRequestSchema, staticController.getImage)
router.post('/image', staticController.postImage)

export default router;