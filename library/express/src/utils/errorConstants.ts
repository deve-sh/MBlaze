import type { Response } from "express";
import errorResponse from "./error";

export const INSUFFICIENT_PERMISSIONS = (res: Response) =>
	errorResponse({
		status: 401,
		message: "Insufficient Permissions",
		res,
	});

export const DOCUMENT_NOT_FOUND = (res: Response) =>
	errorResponse({
		status: 404,
		message: "Document not found",
		res,
	});

export const DOCUMENT_ID_REQUIRED = (res: Response) =>
	errorResponse({
		status: 400,
		message: "Document ID Required",
		res,
	});
