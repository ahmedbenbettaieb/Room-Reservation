import { useAppDispatch, useAppSelector } from "@/pages/redux/store";
import { getUserData } from "@/pages/redux/userSlice";
import { Avatar, Card, Loader, rem, Text } from "@mantine/core";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import Menu from "@/pages/Menu/menu";

export default function Profile() {
  const { user, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  //   useEffect(() => {
  //     dispatch(getUserData());
  //   }, []); // empty dependency array to prevent multiple requests

  const userRole = user && user.role ? user.role : "user";
  const userAvatar =
    userRole && userRole === "superUser"
      ? "https://cdn.vectorstock.com/i/500p/52/38/avatar-icon-vector-11835238.jpg"
      : "https://i.pinimg.com/736x/34/60/3c/34603ce8a80b1ce9a768cad7ebf63c56.jpg";

  const avatarStyle = {
    border: `${rem(2)} solid var(--mantine-color-body)`,
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Card shadow="sm" padding="xl" component="a" target="_blank"
        style={{backgroundImage:"https://www.recruter.tn/wp-content/uploads/2023/01/1673453151956-800x430.jpg"}}
        >
          <Avatar
            src={userAvatar}
            size={80}
            radius={80}
            mx="auto"
            mt={-30}
            style={avatarStyle}
          />
          <Text ta="center" fw={500} size="lg" mt="md">
            <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} />
            Name: {user?.name}
          </Text>
          <Text ta="center" fw={500} size="lg" mt="md">
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "8px" }} />
            Email: {user?.email}
          </Text>
          <Text ta="center" fw={500} size="lg" mt="md">
            <FontAwesomeIcon
              icon={faUserShield}
              style={{ marginRight: "8px" }}
            />
            Role: {userRole}
          </Text>
        </Card>
      )}
    </div>
  );
}
