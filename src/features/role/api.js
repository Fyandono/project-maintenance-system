import { apiController } from "../../core/api/apiController";

export const getRolesList = async (filters) => {

  const params = {
    name: filters.filterName,      
    page: filters.currentPage,     
    page_size: filters.pageSize,   
  };
  const response = await apiController({
            method: 'get',
            endpoint: '/x/role',
            params: params
        });
  return response.data;
};

export const postRole = async (data) => {
  const response = await apiController({
            method: 'post',
            endpoint: '/x/role',
            data: data
        });
  return response.data;
};

export const putRole = async (data) => {
  const response = await apiController({
            method: 'put',
            endpoint: '/x/role',
            data: data
        });
  return response.data;
};

export const getReportList = async (filters) => {

  const params = {
    name: filters.filterName,      
    page: filters.currentPage,     
    page_size: filters.pageSize,   
    is_report: true,
  };
  const response = await apiController({
            method: 'get',
            endpoint: '/x/role',
            params: params
        });
  return response.data;
};