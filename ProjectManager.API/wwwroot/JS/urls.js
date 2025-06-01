//export const API_URL = "http://localhost"
export const API_URL = "http://projectmanagerapi-app-2025052718.wonderfulwave-2a703125.polandcentral.azurecontainerapps.io"

export const addUserUrl = `${API_URL}:80/api/users/add`;
export const getAllUsersUrl = `${API_URL}:80/api/users/all`;
export const deleteUserUrl = `${API_URL}:80/api/users/delete/#id`;
export const editUserUrl = `${API_URL}:80/api/users/update`;

export const updateProjectUrl = `${API_URL}:80/api/projects/update`;
export const getAllProjectsUrl = `${API_URL}:80/api/projects/all`;
export const deleteProjectUrl = `${API_URL}:80/api/projects/delete/#id`;
export const addProjectUrl = `${API_URL}:80/api/projects/add`;

export const getTokenUrl = `${API_URL}:80/api/auth/user`;
export const validateUrl = `${API_URL}:80/api/auth/token`;
export const registerUrl = `${API_URL}:80/api/register`;
