import type RequestCommonConfig from "../types/RequestCommonConfig";

const setRequestConfig = (): RequestCommonConfig => {
	if (typeof window === "undefined")
		return (global as any).mBlazeRequestConfig as RequestCommonConfig;
	else return (window as any).mBlazeRequestConfig as RequestCommonConfig;
};

export default setRequestConfig;
