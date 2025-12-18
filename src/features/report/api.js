import { apiController } from '../../core/api/apiController';

export const getReportList = async (filters) => {
  const params = {
      list_vendor_id: filters.list_vendor_id != "" ? filters.list_vendor_id : null,
      project_start_date: filters.project_start_date != "" ? filters.project_start_date : null,
      project_end_date: filters.project_end_date  != "" ? filters.project_end_date : null,
      completion_start_date: filters.completion_start_date != "" ? filters.completion_start_date : null,
      completion_end_date: filters.completion_end_date  != "" ? filters.completion_end_date : null,
      pm_type: filters.pm_type  != "" ? filters.pm_type : null,
      pm_status: filters.pm_status != "" ? filters.pm_status : null,
  };
  console.log(params);
  const response = await apiController({
            method: 'get',
            endpoint: '/x/report',
            params: params
        });
  
  return response.data;
};

export const getVendorList = async () => {
  const response = await apiController({
            method: 'get',
            endpoint: '/x/all-vendor',
        });
  console.log(response);
  return response.data;
};
