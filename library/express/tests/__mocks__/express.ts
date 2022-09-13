import type { Request, Response } from "express";

export const res = {
	status: function (status: number) {
		return { statusCode: status, ...this };
	},
	sendStatus: function (status: number) {
		return { ...this, statusCode: status, status: status };
	},
	send: function (response: any) {
		return { ...this, ...response, status: this.statusCode };
	},
	json: function (response: any) {
		return { ...this, ...response, status: this.statusCode };
	},
} as Response;

export const next = () => null;
export const generateRequest = (body: Record<string, any>) => {
	return { body } as Request;
};
