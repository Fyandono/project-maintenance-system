// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import vendorsReducer from './features/vendor/vendorSlice'; 
import projectsReducer from './features/project/projectSlice'; 
import pmReducer from './features/pm/pmSlice';
import unitsReducer from './features/project/unitSlice'
import userReducer from './features/user/userSlice'
import pmDetailReducer from './features/pm/pmDetailSlice';
import unitReducer from './features/unit/unitSlice';
import roleReducer from './features/role/roleSlice';
import rolesReducer from './features/user/roleSlice';
import changePasswordReducer from './features/auth/changePasswordSlice';
import reportReducer from './features/report/reportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,

    // vendor
    vendors: vendorsReducer, 

    // project
    projects: projectsReducer,

    // pm
    pms: pmReducer,
    pmDetail: pmDetailReducer,

    // unit
    units: unitsReducer,

    // user
    users: userReducer,
    unit: unitReducer,

    // role
    role: roleReducer,
    roles: rolesReducer,

    // change password
    changePassword: changePasswordReducer,

    // report
    reports: reportReducer,
  },
});