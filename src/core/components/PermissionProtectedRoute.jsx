import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// Define permission mapping for routes
const routePermissionMap = {
  '/vendor': 'can_get_vendor',
  '/user': 'can_get_user',
  '/unit': 'can_get_unit',
  '/role': 'can_get_role',
  '/project': 'can_get_project', // for project pages under vendor
  '/pm': 'can_get_pm', // for PM pages
};

// Helper function to get required permission for current path
const getRequiredPermission = (pathname) => {
  // Check for exact matches first
  for (const [route, permission] of Object.entries(routePermissionMap)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return permission;
    }
  }
  return null; // No permission required for this route
};

export default function PermissionProtectedRoute({ children }) {
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);
  
  // 1. Check authentication
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Get required permission for this route
  const requiredPermission = getRequiredPermission(location.pathname);
  
  // 3. If route requires permission, check if user has it
  if (requiredPermission) {
    // Check if user has the required permission
    const hasPermission = user?.[requiredPermission] === true;
    
    if (!hasPermission) {
      // Redirect to unauthorized page or back to home
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 4. User is authenticated and has permission (or no permission required)
  return children;
}