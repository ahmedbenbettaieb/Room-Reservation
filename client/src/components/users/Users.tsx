import  { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/pages/redux/store";
import { fetchAllUsers } from "@/pages/redux/allUsers/allUsersSlice";
import { Table, Loader, Text, Button, Modal } from "@mantine/core";
import Menu from "@/pages/Menu/menu";
import "./style.css";
import CreateUser from "../createUser/CreateUser";

export default function Users() {
  const dispatch = useAppDispatch();
  const { allUsers, loading, error } = useAppSelector(
    (state) => state.allUsers
  );
  const [modalOpen, setModalOpen] = useState(false);
  // const {user}=useAppSelector((state)=>state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const rows = allUsers?.map((user) => (
    <tr key={user.id}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
    </tr>
  ));

  return (
    <Menu>
      <div>
        <Button onClick={openModal} color="blue" mb="md">
          Create User
        </Button>

        <Modal opened={modalOpen} onClose={closeModal} centered>
          <CreateUser closeModal={closeModal} />
        </Modal>

        {loading ? (
          <Loader />
        ) : error ? (
          <Text color="red">Error: {error}</Text>
        ) : (
          <Table className="table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {allUsers && allUsers.length > 0 ? (
                rows
              ) : (
                <tr>
                  <td colSpan={3}>No users found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </Menu>
  );
}
