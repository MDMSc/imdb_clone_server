import express from "express";
import {
  createProducer,
  editProducer,
  getOneProducer,
  getSearchProducerList,
} from "../controllers/producerController.js";
import { authMiddleware } from "../config/authMiddleware.js";

const router = express.Router();

router.post("/add-producer", authMiddleware, createProducer);
router.get("/:_id", authMiddleware, getOneProducer);
router.get("/", authMiddleware, getSearchProducerList);
router.put("/edit-producer/:_id", authMiddleware, editProducer);

export const producerRouter = router;
