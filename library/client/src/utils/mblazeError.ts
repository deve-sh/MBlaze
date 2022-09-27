class MBlazeException extends Error {
	statusCode?: number;
	response?: Record<string, any>;
	constructor(
		message: string,
		statusCode?: number,
		response?: Record<string, any>
	) {
		super(message);
		this.statusCode = statusCode;
		this.response = response;
	}
}

export default MBlazeException;
