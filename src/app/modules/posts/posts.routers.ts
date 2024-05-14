import express, { NextFunction, Request, Response } from "express"

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {

		res.send({ message: "successfully Posts" });
	} catch (error: any) {
		next(error)
	}
});

export const PostsRoutes = router;