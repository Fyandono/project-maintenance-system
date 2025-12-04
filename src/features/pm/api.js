import { apiController } from '../../core/api/apiController';

export const getPMList = async (filters) => {
  const params = {
    project_id: filters.projectId,
    description: filters.filterDescription,
    start_date: filters.filterStartDate,
    end_date: filters.filterEndDate,
    page: filters.currentPage,     
    page_size: filters.pageSize,   
  };

  const response = await apiController({
            method: 'get',
            endpoint: '/x/pm',
            params: params
        });
  
  return response.data;
};

export const postPM = async (data) => {

  const response = await apiController({
            method: 'post',
            endpoint: '/x/pm',
            data: data
        });
  
  return response.data;
};


export const editPM = async (data) => {

  const response = await apiController({
            method: 'put',
            endpoint: '/x/pm',
            data: data
        });
  
  return response.data;
};

export const verifyPM = async (data) => {

  const response = await apiController({
            method: 'put',
            endpoint: '/x/verify',
            data: data
        });
  
  return response.data;
};


export const getDetailPM = async (params) => {

  const response = await apiController({
            method: 'get',
            endpoint: '/x/pm-detail',
            params: params
        });
  
  return response.data;
};