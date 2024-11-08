import { useState } from 'react';
import axiosInstance from '@/config/AxiosInstance';
import { useAuth } from '@/contexts/authContext';
import { LoginValues } from '@/types/loginValues';
import { showNotification } from '@mantine/notifications';



export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuth(); 

  const login = async (values: LoginValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/auth/login', values);
      if (response.status === 200) {
        const { access_token,refresh_token } = response.data;
        setToken(access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('token', access_token); 
        showNotification({
          message: 'Login successful.',
          color: 'green',
          autoClose: 5000,
          position: 'top-right'
        })
      }
    } catch (err: any) {
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        setError('Invalid email or password.');
        showNotification({
          message: 'Invalid email or password.',
          color: 'red',
          autoClose: 5000,
          position: 'top-right'
        })

      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
