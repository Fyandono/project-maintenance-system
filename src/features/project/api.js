import { apiController } from '../../core/api/apiController';

export const getProjectsList = async (filters) => {
  const params = {
    vendor_id: filters.vendorId,
    name: filters.filterName,      
    page: filters.currentPage,     
    page_size: filters.pageSize,   
  };

  const response = await apiController({
            method: 'get',
            endpoint: '/x/project',
            params: params
        });
  
  return response.data;
};

export const getUnitsList = async (filters) => {
  const params = {
    is_active: "true",    
    name: filters.filterName,  
    page: 1,     
    page_size: 1000,   
  };

  const response = await apiController({
            method: 'get',
            endpoint: '/x/unit',
            params: params
        });
  
  return response.data;
};

export const postProject = async (data) =>{

  const response = await apiController({
            method: 'post',
            endpoint: '/x/project',
            data: data  
        });
  
  return response.data;
};

export const putProject = async (data) =>{

  const response = await apiController({
            method: 'put',
            endpoint: '/x/project',
            data: data  
        });
  
  return response.data;
};