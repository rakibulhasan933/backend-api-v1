import express, { NextFunction, Request, Response } from "express"

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.send({ message: "successfully Users" });
	} catch (error: any) {
		next(error)
	}
});

export const UsersRoutes = router;