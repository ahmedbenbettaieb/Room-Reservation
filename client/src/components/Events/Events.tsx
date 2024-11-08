import React, { useEffect, useState } from "react";
import { ReservationEvent } from "@/types/evenType";
import axiosInstance from "@/config/AxiosInstance";
import Menu from "@/pages/Menu/menu";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { Button, Modal } from "@mantine/core";
import { RoomType } from "@/types/roomType";
import { parseISO } from "date-fns";

import "react-calendar/dist/Calendar.css";
import "./CalendarStyles.css";
import ReserveRoom from "../ReserveRoom/ReserveRoom";
import { useAppDispatch, useAppSelector } from "@/pages/redux/store";
import { getEvents } from "@/pages/redux/reservation/reservationSlice";
import { getRooms } from "@/pages/redux/room/roomSlice";

export default function Events() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [reservationData, setReservationData] = useState<any | null>(null);
  const { events } = useAppSelector((state) => state.reservation);
  const { user } = useAppSelector((state) => state.user);
  const {rooms}=useAppSelector((state)=>state.room)
  const dispatch = useAppDispatch();
  const [filteredEvents, setFilteredEvents] = useState<ReservationEvent[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdated(false);
    setReservationData(null);
  };

  const handleEventClick = (info: any) => {
    const event = events.find((e) => e.id.toString() === info.event.id);
    if (event) {
      const startDate = parseISO(event.start_date);
      const endDate = parseISO(event.end_date);

      setIsUpdated(true);
      setReservationData({
        title: event.title,
        date: startDate,
        start_time: event.start_date.substr(11, 5),
        end_time: event.end_date.substr(11, 5),
        description: event.description,
        room_id: event.room_id.toString(),
        event_id: event.id,
        participants: event.participants,
      });
      setIsModalOpen(true);
    }
  };

  const calendarEvents = filteredEvents.map((event) => ({
    id: event.id.toString(),
    title: event.title,
    start: event.start_date,
    end: event.end_date,
    description: event.description,
    resourceId: event.room_id.toString(),
    roomId: event.room_id,
  }));

  const calendarResources = rooms.map((room) => ({
    id: room.id.toString(),
    title: room.name,
  }));

  const toggleFilterEventsByUserId = () => {
    if (isFiltering) {
      setFilteredEvents(events);
    } else if (user?.id) {
      const userFilteredEvents = events.filter((event) =>
        event.participants?.some(
          (participant) => participant.user_id === user.id
        )
      );
      setFilteredEvents(userFilteredEvents);
    }
    setIsFiltering(!isFiltering);
  };

  return (
    <Menu>
      <div className="button-container">
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setIsUpdated(false);
          }}
        >
          Reserve A Room
        </Button>
        <Button onClick={toggleFilterEventsByUserId}>
          {isFiltering ? "Show All Reservations" : "Show My Reservations"}
        </Button>
      </div>

      <FullCalendar
        plugins={[resourceTimelinePlugin]}
        initialView="resourceTimelineDay"
        resources={calendarResources}
        events={calendarEvents}
        weekends={false}
        slotMinTime="08:00:00"
        slotMaxTime="19:00:00"
        slotDuration={"01:00:00"}
        eventClick={handleEventClick}
      />
      <Modal
        opened={isModalOpen}
        onClose={closeModal}
        title={isUpdated ? "Update Reservation" : "Reserve a Room"}
      >
        <ReserveRoom
          room={rooms[0]}
          allRooms={rooms}
          closeModal={closeModal}
          isUpdated={isUpdated}
          reservationData={reservationData}
        />
      </Modal>
    </Menu>
  );
}
