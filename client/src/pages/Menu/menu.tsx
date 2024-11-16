import React from "react";
import {
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Image
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/pages/redux/store"; // Assuming you are using redux for user data
import classes from "./MobileNavbar.module.css";
import { useLogout } from "@/hooks/useLogout";
import image from "../../assets/img/ulysse.png";

// Children props
interface Props {
  children: React.ReactNode;
}

export default function Menu({ children }: Props) {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const { logout, error } = useLogout();

  const { user } = useAppSelector((state) => state.user);  const handleLogout = async () => {
    await logout();

    if (!error) {
      navigate("/login");
    }
  };

  const isSuperUser = user?.role === 'superUser'; 

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Image src={image} height={40} width={40} />
            <Group ml="xl" gap={0} visibleFrom="sm">
              <UnstyledButton className={classes.control} onClick={() => navigate("/profile")}>
                Profile
              </UnstyledButton>
              {isSuperUser && (
                <UnstyledButton
                  className={classes.control}
                  onClick={() => navigate("/all-users")}
                >
                  Users
                </UnstyledButton>
              )}
              {isSuperUser && (
                <UnstyledButton
                  className={classes.control}
                  onClick={() => navigate("/rooms")}
                >
                  Rooms
                </UnstyledButton>
              )}
              <UnstyledButton className={classes.control} onClick={() => navigate("/events")}>
                Events
              </UnstyledButton>
              <UnstyledButton className={classes.control} onClick={handleLogout}>
                Logout
              </UnstyledButton>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton className={classes.control} onClick={() => navigate("/profile")}>
          Profile
        </UnstyledButton>
        {isSuperUser && (
          <>
          <UnstyledButton className={classes.control} onClick={() => navigate("/all-users")}>
            Users
          </UnstyledButton>
            <UnstyledButton className={classes.control} onClick={() => navigate("/rooms")}>
            Rooms
          </UnstyledButton>
          </>
        )}

        <UnstyledButton className={classes.control} onClick={() => navigate("/events")}>
          Events
        </UnstyledButton>
        <UnstyledButton className={classes.control} onClick={handleLogout}>
          Logout
        </UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
