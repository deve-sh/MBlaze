import type OpRequesterArgs from "./OpRequesterArgs";

export type RequestConfig = {
	headers?: Record<string, any>;
};

type RequestCommonConfig =
	| RequestConfig
	| ((args: OpRequesterArgs | Array<OpRequesterArgs>) => RequestConfig);

export default RequestCommonConfig;
