// AppRoutes.tsx
import React, { lazy, Suspense } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import CustomLoadingOverlay from "../components/customLoading/CustomLoadingOverlay";
import { PATH_APP } from "./paths";
import Menu from "@/pages/Menu/menu";
import ProtectedRoute from "@/components/protectedRoute/ProtectedRoute";
import Users from "@/components/users/Users";

const Loadable = (Component: React.FC) => (props: typeof Component.propTypes) => {
  return (
    <Suspense fallback={<CustomLoadingOverlay />}>
      <Component {...props} />
    </Suspense>
  );
};

const Landing = Loadable(lazy(() => import('@pages/landing/LandingPage')));
const Page404 = Loadable(lazy(() => import('@pages/errors/Page404')));
const Login = Loadable(lazy(() => import('@pages/login/loginPage')));
const FirstPage = Loadable(lazy(() => import('@pages/FirstPage/firstPage')));
const Events= Loadable(lazy(() => import('@pages/Events/EventPage')));
const AllUsersPage = Loadable(lazy(() => import('@pages/AllUsers/AllUsersPage')));
const Profile = Loadable(lazy(() => import('@pages/profilePage/profilePage')));
const Rooms= Loadable(lazy(() => import('@pages/rooms/roomsPage')));
export default function AppRoutes() {
  return useRoutes([
    {
      path: PATH_APP.general.landing,
      element: (
          <Landing />
      )
  },
    {
      path: "/login",
      element: <Login />
    },
    
    {
      path: "*",
      element: <Page404 />
    },
    {
      path: "/",
      element: 
      <ProtectedRoute>      <FirstPage />
    </ProtectedRoute>
    },
    {
      path: "/events",
      element: 
      <ProtectedRoute>
      <Events />
      </ProtectedRoute>

    },
    {
      path:'/all-users',
      element:
      <ProtectedRoute requiredRole="superUser">
      <AllUsersPage/>
      </ProtectedRoute>
      
    }
    ,{
      path:'/rooms',
      element:
      <ProtectedRoute requiredRole="superUser" >
      <Rooms/>
      </ProtectedRoute>
      
    }
    ,
    {
      path: "/profile",
      element:
      <ProtectedRoute>
      <Profile />
      </ProtectedRoute>
    }
  ]);
}