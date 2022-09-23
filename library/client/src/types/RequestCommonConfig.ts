import type OpRequesterArgs from "./OpRequesterArgs";

export type RequestConfig = {
	headers?: {};
};

type RequestCommonConfig =
	| RequestConfig
	| ((args: OpRequesterArgs) => RequestConfig);

export default RequestCommonConfig;
