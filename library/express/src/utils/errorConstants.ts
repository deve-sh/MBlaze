export const INSUFFICIENT_PERMISSIONS = () => ({
	status: 401,
	message: "Insufficient Permissions",
});

export const DOCUMENT_NOT_FOUND = () => ({
	status: 404,
	message: "Document not found",
});

export const DOCUMENT_ID_REQUIRED = () => ({
	status: 400,
	message: "Document ID Required",
});
