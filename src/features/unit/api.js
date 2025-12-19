import { apiController } from "../../core/api/apiController";

export const getUnitsList = async (filters) => {

  const params = {
    name: filters.filterName,      
    page: filters.currentPage,     
    page_size: filters.pageSize,   
  };
  const response = await apiController({
            method: 'get',
            endpoint: '/x/unit',
            params: params
        });
  return response.data;
};

export const postUnit = async (data) => {
  const response = await apiController({
            method: 'post',
            endpoint: '/x/unit',
            data: data
        });
  return response.data;
};

export const putUnit = async (data) => {
  const response = await apiController({
            method: 'put',
            endpoint: '/x/unit',
            data: data
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
            endpoint: '/x/unit',
            params: params
        });
  return response.data;
};
