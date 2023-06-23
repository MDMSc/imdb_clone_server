import express from "express";
import { createActor, editActor, getOneActor, getSearchActorList } from "../controllers/actorControllers.js";
import { authMiddleware } from "../config/authMiddleware.js";

const router = express.Router();

router.post("/add-actor", authMiddleware, createActor);
router.get("/:_id", authMiddleware, getOneActor);
router.get("/", authMiddleware, getSearchActorList);
router.put("/edit-actor/:_id", authMiddleware, editActor);

export const actorRouter = router;