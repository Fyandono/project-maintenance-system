import { apiController } from "../../core/api/apiController";

export const apiLoginUser = async (username, password) => {
  const response = await apiController({
    method:'post',
    endpoint:'/login',
    data:{username, password}
  });

  return response.data.access_token;
};