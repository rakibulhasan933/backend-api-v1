 import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

	let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
	let success = false;
	let message = err.message || " something is Wrong !";
	let error = err;

	if (err instanceof Prisma.PrismaClientValidationError) {
		message = "validation Error";
		error = err.message;
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2002") {
			message = `a new user cannot be created with this ${err.meta?.target}`
			error = err.meta;
		}
	}
	res.status(statusCode).json({
		success,
		message,
		error,
	});
};

export default globalErrorHandler;