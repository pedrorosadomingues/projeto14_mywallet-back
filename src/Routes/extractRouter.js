import { Router } from "express";
import { newEntry, newExit, getExtract } from "../Controller/extract.js";
import { transactSchema } from "../Schema/extractSchema.js";
import { validateSchema } from "../Middleware/validateSchema.js";
import { validateSession } from "../Middleware/validateSession.js";
import { deleteTransact } from "../Controller/extract.js";



const extractRouter = Router();

extractRouter.post("/new-entry", validateSchema(transactSchema), validateSession, newEntry);
extractRouter.post("/new-exit", validateSchema(transactSchema), validateSession, newExit);
extractRouter.get("/extract", validateSession, getExtract);
extractRouter.delete("/extract/:id", validateSession, deleteTransact);

export default extractRouter;