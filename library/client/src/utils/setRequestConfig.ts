import type RequestCommonConfig from "../types/RequestCommonConfig";

const setRequestConfig = (config: RequestCommonConfig) => {
	if (typeof window === "undefined")
		return ((global as any).mBlazeRequestConfig = config);
	else return ((window as any).mBlazeRequestConfig = config);
};

export default setRequestConfig;
