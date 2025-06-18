import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:2112",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response, // Handles successful responses (e.g., 200 OK)
  (error) => { // Handles errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      window.location.href = "/signIn";
    }
    return Promise.reject(error);
  }
);

// Question API
export const questionsAPI = {
  getAllQuestions: () => axiosInstance.get("/api/question"),
  getQuestionById: (id) => axiosInstance.get(`/api/question/${id}`),
};

// Answer API
export const answersAPI = {
  getAnswersByQuestionId: (questionId) =>
    axiosInstance.get(`/api/answer/${questionId}`),
  postAnswer: (answerData) => axiosInstance.post("/api/answer", answerData),
};

export default axiosInstance;
