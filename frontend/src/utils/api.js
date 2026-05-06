// ==========================
// API file for connecting to Java Spring Boot backend
// ==========================

// Base backend URL
const API_BASE_URL = `http://localhost:8081/api`;

// ==========================
// Helper function to make API calls
// =========================
const apiCall = async (url, options = {}) => {
  const fullUrl = `${API_BASE_URL}${url}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // 🔐 Add token if available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(fullUrl, config);

    // If response is not OK
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    // If DELETE or empty body → skip parsing JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { message: "Success" };
    }

    // Parse JSON if available
    return await response.json();
  } catch (error) {
    console.error("❌ API call failed:", error);
    throw error;
  }
};

// ==========================
// Authentication APIs
// ==========================
export const login = async (email, password) => {
  return apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name, email, password) => {
  return apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

export const logout = async () => {
  return apiCall("/auth/logout", { method: "POST" });
};

// ==========================
// Student APIs
// ==========================
export const getStudents = async () => {
  return apiCall("/students", { method: "GET" });
};

export const getStudent = async (id) => {
  return apiCall(`/students/${id}`, { method: "GET" });
};

export const addStudent = async (studentData) => {
  return apiCall("/students", {
    method: "POST",
    body: JSON.stringify(studentData),
  });
};

export const updateStudent = async (id, studentData) => {
  return apiCall(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(studentData),
  });
};

export const deleteStudent = async (id) => {
  return apiCall(`/students/${id}`, {
    method: "DELETE",
  });
};

// ==========================
// Profile APIs
// ==========================
export const getProfile = async () => {
  return apiCall("/profile", { method: "GET" });
};

export const updateProfile = async (profileData) => {
  return apiCall("/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

export const getUser = async (id) => {
  return apiCall(`/users/${id}`, { method: "GET" });
};

export const updateUser = async (id, data) => {
  return apiCall(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// ==========================
// Dashboard APIs
// ==========================
export const getDashboardStats = async () => {
  return apiCall("/dashboard/stats", { method: "GET" });
};

export const getStudentsByDepartment = async () => {
  return apiCall("/dashboard/department-breakdown", { method: "GET" });
};

export const getStudentsByDivision = async () => {
  return apiCall("/dashboard/division-breakdown", { method: "GET" });
};

export const getGenderDistribution = async () => {
  return apiCall("/dashboard/gender-distribution", { method: "GET" });
};

export const getRecentEnrollments = async () => {
  return apiCall("/dashboard/recent-enrollments", { method: "GET" });
};

// ==========================
// Test Backend Connectivity
// ==========================
export const testBackend = async () => {
  return apiCall("/test", { method: "GET" });
};
