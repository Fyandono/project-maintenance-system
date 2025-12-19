import { apiController } from "../../core/api/apiController";

export const getVendorsList = async (filters) => {

  const params = {
    name: filters.filterName,      
    page: filters.currentPage,     
    page_size: filters.pageSize,   
  };
  const response = await apiController({
            method: 'get',
            endpoint: '/x/vendor',
            params: params
        });
  return response.data;
};

export const postVendor = async (data) => {
  const response = await apiController({
            method: 'post',
            endpoint: '/x/vendor',
            data: data
        });
  return response.data;
};

export const putVendor = async (data) => {
  const response = await apiController({
            method: 'put',
            endpoint: '/x/vendor',
            data: data
        });
  return response.data;
};

export const getReportVendor = async (filters) => {

  const params = {
    name: filters.filterName,      
    page: filters.currentPage,     
    page_size: filters.pageSize,   
    is_report: true, 
  };
  const response = await apiController({
            method: 'get',
            endpoint: '/x/vendor',
            params: params
        });
  return response.data;
};
