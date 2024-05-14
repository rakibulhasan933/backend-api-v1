import express, { Application, NextFunction, Response, Request } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import httpStatus from "http-status"
import globalErrorHandler from "./middlewares/globalErrorHandler";
import config from "./config";
import router from "./app/routers";



const app: Application = express();
app.use(cors());
app.use(cookieParser());


// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get('/', (req: Request, res: Response) => {
	res.send({
		message: `Backend Server Running on...Port:${config.port}`
	});
});

// Routes
app.use('/api/v1', router);

// Not-Found
app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(httpStatus.NOT_FOUND).json({
		success: false,
		message: "API NOT FOUND",
		error: {
			path: req.originalUrl,
			message: " Your Requested path is not found !"
		}
	})
});

// Global Error Handling
app.use(globalErrorHandler);

export default app;


