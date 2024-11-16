import  { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/pages/redux/store";
import { getRooms } from "@/pages/redux/room/roomSlice";
import Menu from "@/pages/Menu/menu";
import { Button, Table, Pagination, Modal } from "@mantine/core";
import { RoomType } from "@/types/roomType";
import RoomModal from "../createRoom/roomModal";

export default function Rooms() {
  const { rooms } =
    useAppSelector((state) => state.room);
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[isUpdated, setIsUpdated] = useState(false);
  const [roomToUpdate, setRoomToUpdate] = useState<RoomType | null>();
  const rowsPerPage = 5;

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  const sortedRooms = [...rooms].sort((a, b) => {
    return b.id - a.id
  });
  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdated(false);
    setRoomToUpdate(null);
  };

  const handleEditClick = (roomId:number) => {
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      setIsUpdated(true);
      setRoomToUpdate(room);
    }
    setIsModalOpen(true);
    

  }
  const handleCreateClick = () => {
    setIsModalOpen(true);
  };


  const totalPages = Math.ceil(sortedRooms.length / rowsPerPage);
  const paginatedRooms = sortedRooms.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const rows = paginatedRooms.map((room) => {
    return (
      <tr key={room.id}>
        <td>{room.name}</td>
        <td>{room.capacity}</td>
        <td>{room.description}</td>
        <td>{room.amenities}</td>
        <td>
          <Button onClick={() => handleEditClick(room.id)}>Edit</Button>
        </td>
        <td>
          <Button color="red" onClick={() => {}}>Delete</Button>
        </td>
      </tr>
    );
  });

  return (
    <Menu>
      <Button onClick={handleCreateClick}>Create Room</Button>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Description</th>
            <th>Amenities</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      <Pagination
        value={currentPage}
        onChange={handlePageChange}
        total={totalPages}
        siblings={1}
      />
      <Modal opened={isModalOpen} onClose={closeModal}>
        <RoomModal
          room={roomToUpdate}
          closeModal={closeModal}
          isUpdated={isUpdated}

        />
      </Modal>
    </Menu>
  );
}
