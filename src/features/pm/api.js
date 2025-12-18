import { apiController } from '../../core/api/apiController';

export const getPMList = async (filters) => {
  const params = {
    project_id: filters.projectId,
    description: filters.filterDescription,
    project_start_date: filters.filterProjectStartDate != "" ? filters.filterProjectStartDate : null,
    project_end_date: filters.filterProjectEndDate  != "" ? filters.filterProjectEndDate : null,
    completion_start_date: filters.filterCompletionStartDate != "" ? filters.filterCompletionStartDate : null,
    completion_end_date: filters.filterCompletionEndDate  != "" ? filters.filterCompletionEndDate : null,
    pm_type: filters.filterPMType  != "" ? filters.filterPMType : null,
    pm_status: filters.filterPMStatus != "" ? filters.filterPMStatus : null,
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