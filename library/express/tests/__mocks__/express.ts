import type { Response } from "express";

const res = {
	status: function (status: number) {
		return { statusCode: status, ...this };
	},
	send: function (response: any) {
		return { ...response, status: this.statusCode };
	},
	json: function (response: any) {
		return { ...response, status: this.statusCode };
	},
};

export default res as Response;
