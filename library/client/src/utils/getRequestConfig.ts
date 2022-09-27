import type OpRequesterArgs from "../types/OpRequesterArgs";
import RequestCommonConfig, {
	RequestConfig,
} from "../types/RequestCommonConfig";

const getRequestConfig = (
	args: OpRequesterArgs | Array<OpRequesterArgs>
): RequestConfig => {
	let requestCommonConfig;
	if (typeof window === "undefined")
		requestCommonConfig = (global as any)
			.mBlazeRequestConfig as RequestCommonConfig;
	else
		requestCommonConfig = (window as any)
			.mBlazeRequestConfig as RequestCommonConfig;

	if (typeof requestCommonConfig === "function") {
		const config = requestCommonConfig(args);
		return config as RequestConfig;
	}

	return requestCommonConfig as RequestConfig;
};

export default getRequestConfig;
