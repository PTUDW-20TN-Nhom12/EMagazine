// Dummy route for testing purpose
import express, { Router, Request, Response } from "express";

import {addTag, getAllTags} from "../controllers/tag_controller"

const router: Router = Router();

router.use(express.json());

router.get("/", async (req: Request, res: Response) => {
    res.status(200).json(await getAllTags());
})

router.post("/", async (req: Request, res: Response) => {
    const t = req.body; // json of tag
    res.status(200).json(await addTag(t));
})

export {router as TagRouter};