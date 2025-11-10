import request from "@/utils/Request";

export const test = () => {
	return request({
		url: "/captcha/get",
		method: "POST"
	})
}