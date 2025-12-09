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

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vendors: vendorsReducer, 
    projects: projectsReducer,
    pms: pmReducer,
    pmDetail: pmDetailReducer,
    units: unitsReducer,
    users: userReducer,
    unit: unitReducer,
    role: roleReducer,
    roles: rolesReducer,
  },
});