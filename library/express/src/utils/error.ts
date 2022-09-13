import type { Response } from "express";

const errorResponse = ({
	status = 400,
	message,
	res,
	extraFields,
}: {
	status: number;
	message: string;
	res: Response;
	extraFields?: Record<string, any>;
}) =>
	res.status(status).json({ status, error: message, message, ...extraFields });

export default errorResponse;
