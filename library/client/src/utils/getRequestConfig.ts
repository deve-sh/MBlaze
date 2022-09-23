import type OpRequesterArgs from "../types/OpRequesterArgs";
import type RequestCommonConfig from "../types/RequestCommonConfig";

const getRequestConfig = (args: OpRequesterArgs): RequestCommonConfig => {
	let requestCommonConfig;
	if (typeof window === "undefined")
		requestCommonConfig = (global as any)
			.mBlazeRequestConfig as RequestCommonConfig;
	else
		requestCommonConfig = (window as any)
			.mBlazeRequestConfig as RequestCommonConfig;

	if (typeof requestCommonConfig === "function") {
		const config = requestCommonConfig(args);
		return config;
	}

	return requestCommonConfig;
};

export default getRequestConfig;
