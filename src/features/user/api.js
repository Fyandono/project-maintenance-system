import { apiController } from "../../core/api/apiController";

export const getUsersList = async (filters) => {

  const params = {
    name: filters.filterName,      
    page: filters.currentPage,     
    page_size: filters.pageSize,   
  };
  const response = await apiController({
            method: 'get',
            endpoint: '/x/user',
            params: params
        });
  return response.data;
};

export const postUser = async (data) => {
  const response = await apiController({
            method: 'post',
            endpoint: '/x/register',
            data: data
        });
  return response.data;
};

export const putUser = async (data) => {
  const response = await apiController({
            method: 'put',
            endpoint: '/x/edit-user',
            data: data
        });
  return response.data;
};

export const getRolesList = async (filters) => {
  const params = {
    is_active: "true",    
    name: filters.filterName,  
    page: 1,     
    page_size: 1000,   
  };

  const response = await apiController({
            method: 'get',
            endpoint: '/x/role',
            params: params
        });
  
  return response.data;
};

export const getReportList = async (filters) => {

  const params = {
    name: filters.filterName,      
    page: filters.currentPage,     
    page_size: filters.pageSize,   
    is_active: true,
  };
  const response = await apiController({
            method: 'get',
            endpoint: '/x/user',
            params: params
        });
  return response.data;
};
