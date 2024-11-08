import {
  createRoom,
  getRooms,
  resetRoom,
  updateRoom,
} from "@/pages/redux/room/roomSlice";
import { useAppDispatch, useAppSelector } from "@/pages/redux/store";
import { RoomType } from "@/types/roomType";
import { Button, NumberInput, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React, { useEffect } from "react";

interface RoomProps {
  room: RoomType | null | undefined;
  closeModal: () => void;
  isUpdated: boolean;
}

export default function roomModal({ room, closeModal, isUpdated }: RoomProps) {
  const dispatch = useAppDispatch();
  const { createSuccess, updateSuccess, error } = useAppSelector(
    (state) => state.room
  );

  const form = useForm({
    initialValues: {
      name: "",
      capacity: 0,
      description: "",
      amenities: "",
      image: "",
    },
    validate: {
      name: (value) => (value ? null : "Name is required"),
      capacity: (value) =>
        (value ? null : "Capacity is required") &&
        (value > 0 ? null : "Capacity must be greater than 0"),
      description: (value) => (value ? null : "Description is required"),
      amenities: (value) => (value ? null : "Amenities is required"),
    },
  });
  useEffect(() => {
    if (isUpdated && room) {
      form.setValues({
        name: room.name,
        capacity: room.capacity,
        description: room.description,
        amenities: room.amenities,
      });
    }
  }, [isUpdated, room]);

  const handleSubmit = async (values: any) => {
    console.log("handle submit", values);
    if (isUpdated && room) {
      console.log("update room", values);
      dispatch(updateRoom({ roomId: room?.id, values }));
    } else {
      console.log("create room", values);
      dispatch(
        createRoom({
          name: values.name,
          capacity: values.capacity,
          description: values.description,
          amenities: values.amenities,
        })
      );
    }
    dispatch(getRooms());
  };

  
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      notifications.show({
        title: "Success",
        message:  isUpdated ? "Room updated successfully" : "Room created successfully",
        color: "green",
        autoClose: 4000,
        position: "top-right",
      });

      dispatch(resetRoom());
      closeModal();
    }

    if (error) {
      notifications.show({
        title: "Error",
        message: error,
        color: "red",
        autoClose: 4000,
        position: "top-right",
      });
      dispatch(resetRoom());
    }
  }, [createSuccess, updateSuccess, error, dispatch, closeModal, isUpdated]);

  return (
    <div>
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
      >
        <TextInput
          label="Name"
          placeholder="Name"
          {...form.getInputProps("name")}
        />

        <NumberInput
          label="Capacity"
          placeholder="Capacity"
          {...form.getInputProps("capacity")}
          min={5}
        />

        <Textarea
          label="Description"
          placeholder="Description"
          {...form.getInputProps("description")}
        />

        <Textarea
          label="Amenities"
          placeholder="Amenities"
          {...form.getInputProps("amenities")}
        />
        <Button type="submit" mt={10}>
          {isUpdated ? "Update Room" : "Create Room"}
        </Button>
      </form>
    </div>
  );
}
