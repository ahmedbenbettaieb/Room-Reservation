import axiosInstance from "@/config/AxiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "@/pages/redux/store";  // Assuming you are using Redux
import { resetUser } from "@/pages/redux/userSlice";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); 
  const token = localStorage.getItem('token');
  
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const logout = async () => {
    setLoading(true);
    setError(null); 
    try {
      // Perform logout API call
      await axiosInstance.post('/auth/logout', {}, { headers });

      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');

      dispatch(resetUser());  

      navigate('/login');
    } catch (err: any) {
      setError(err.message);  
    } finally {
      setLoading(false);  
    }
  };

  return { logout, loading, error };
};
