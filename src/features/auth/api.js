import {apiController} from "../../core/api/apiController";
export const apiLoginUser = async (username, password) => {
	const response = await apiController({method: "post", endpoint: "/login", data: {username: username, password: password}});
	return response.data.access_token;
};
export const apiChangePassword = async (newPassword, currentPassword) => {
	console.log("API");
	const response = await apiController({method: "put", endpoint: "/x/change-password", data: {password: currentPassword, new_password: newPassword}});
	return response.data.access_token;
};
