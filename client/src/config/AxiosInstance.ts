import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 15000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const setAuthToken = async (config: any) => {
  try {
    const token = localStorage.getItem(import.meta.env.AUTH_TOKEN || "@token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
  } catch (error) {
    // saving error
  }
};

// const responseHandler = (response: AxiosResponse) => {
//   return response;
// };

// const errorHandler = async (error: AxiosError) => {
//   try {
//     const token = localStorage.getItem(import.meta.env.AUTH_TOKEN || "@token");
//     if (
//       error.code === AxiosError.ERR_NETWORK ||
//       error.code === AxiosError.ETIMEDOUT
//     ) {
//       console.log("network error");
//     }
//     if (token && error.response?.status === 401) {
//       console.log("unauthorized");
//       const newToken = await refreshToken();
//       if(newToken){
//         localStorage.setItem(import.meta.env.AUTH_TOKEN || "@token", newToken);
//         if(error.config){
//           error.config.headers.Authorization = `Bearer ${newToken}`;
//            return axiosInstance(error.config);

//         }

      
      
//       }
//     }
//     if (error.response?.status === 500) {
//       console.log("server error");
//     }
//     return Promise.reject(error);
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };




// const refreshToken = async () => {
//   try {
//     const token = localStorage.getItem(import.meta.env.AUTH_TOKEN || "@token");
//     if (token) {
//       const response = await axiosInstance.post(
//         "auth/refresh-token",
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      const headers = {
        Authorization: `Bearer ${refreshToken}`,
      }
      if (refreshToken) {
        try {
          const response = await axiosInstance.post(`auth/refresh-token`, {headers});
          const newAccessToken = response.data.access_token;
          localStorage.setItem('token', newAccessToken); 
          console.log("new access token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest); 
        } catch (error) {
          console.log(error);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
