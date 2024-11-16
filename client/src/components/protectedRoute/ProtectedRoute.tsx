import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useAppDispatch, useAppSelector } from "@/pages/redux/store";
import { getUserData } from "@/pages/redux/userSlice";

interface Props {
  children: React.ReactNode;
  requiredRole?: string; 
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading, error } = useAppSelector((state) => state.user);
  const { token } = useAuth(); 
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!user && token) {
      dispatch(getUserData())
        .unwrap()
        .catch(() => {
          navigate('/login');
        });
    } else if (!token) {
      navigate('/login');
    }

    if (requiredRole && user?.role !== requiredRole) {
      navigate('/'); 
    }

    setIsInitialLoad(false);
  }, [dispatch, user, navigate, token, requiredRole]);

  if (isInitialLoad || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>{children}</div>;
}
