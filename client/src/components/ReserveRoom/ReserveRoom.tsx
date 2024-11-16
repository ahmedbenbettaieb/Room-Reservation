import { useEffect } from 'react';
import { Button, MultiSelect, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateInput, TimeInput } from '@mantine/dates';
import { RoomType } from '@/types/roomType';
import { format, isBefore, parseISO } from 'date-fns';
import { notifications } from '@mantine/notifications';
import { useAppDispatch, useAppSelector } from '@/pages/redux/store';
import { getEvents, reserveRoom, resetReservation, updateEvent } from '@/pages/redux/reservation/reservationSlice';
import { fetchAllUsers } from '@/pages/redux/allUsers/allUsersSlice';
import { Participant } from '@/types/participantType';

interface ReserveRoomProps {
  room: RoomType;
  allRooms: RoomType[];
  closeModal: () => void;
  isUpdated: boolean;
  reservationData?: {

    title: string;
    date: Date;  
    start_time: string;
    end_time: string;
    description: string;
    room_id: string;
    event_id?: string;
    participants?:Participant[];
  };
}

const ReserveRoom = ({  allRooms, closeModal, isUpdated, reservationData }: ReserveRoomProps) => {
  const dispatch = useAppDispatch();
  const { success, error ,reservationSuccess, updateSuccess} = useAppSelector((state) => state.reservation);
  const {allUsers} = useAppSelector((state) => state.allUsers);
  
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const form = useForm({
    initialValues: {
      title: '',
      date: null as Date | null,  // Initialize as null
      start_time: '',
      end_time: '',
      description: '',
      room_id: '',
      participants: [] as string[],
      
    },
    validate: {
      title: (value) => (value ? null : 'Title is required'),
      date: (value) => (value ? null : 'Date is required'),
      start_time: (value) => (value ? null : 'Start Time is required'),
      end_time: (value, values) => {
        if (!value) return 'End Time is required';
        if (!values.date) return 'Please select a date first';
        
        const dateStr = format(values.date, 'yyyy-MM-dd');
        const startTime = parseISO(`${dateStr}T${values.start_time}`);
        const endTime = parseISO(`${dateStr}T${value}`);
        
        if (isBefore(endTime, startTime)) return 'End Time must be after Start Time';
        return null;
      },
      description: (value) => (value ? null : 'Description is required'),
      room_id: (value) => (value ? null : 'Room is required'),
    },
  });

  useEffect(() => {
    if (isUpdated && reservationData) {
      form.setValues({
        title: reservationData.title,
        date: reservationData.date,  // Now it's already a Date object
        start_time: reservationData.start_time,
        end_time: reservationData.end_time,
        description: reservationData.description,
        room_id: reservationData.room_id,
        participants: reservationData.participants?.map((p) => p.user_id.toString()) || [],  

      });
    }
  }, [isUpdated, reservationData]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!values.date) return;
    
    const formattedDate = format(values.date, 'yyyy-MM-dd');
    const submitValues = {
      ...values,
      date: formattedDate,

    };
    if (isUpdated && reservationData) {
      
      dispatch(updateEvent({ eventId: Number(reservationData.event_id), values: submitValues }));
     
     
    }else {
      dispatch(reserveRoom(submitValues));
     

    }
    dispatch(getEvents());

  };

 



  // function userIdToSendToTheUpdateModal() {
  //   if (isUpdated && reservationData) {
  //     return reservationData.participants?.map((participant) => participant.user_id);
  //   }
  // }
  console.log("success", success);

  useEffect(() => {
    if (reservationSuccess || updateSuccess) {
      notifications.show({
        title: isUpdated ? 'Update Successful' : 'Reservation Successful',
        message: isUpdated ? 'Event updated successfully' : 'Reservation successful',
        color: 'green',
        position: 'top-right',
        autoClose: 4000,
      });
      dispatch(resetReservation());
      closeModal();
    }
  
    if (error) {
      notifications.show({
        title: 'Error',
        message: error,
        color: 'red',
        position: 'top-right',
        autoClose: 4000,
      });
      dispatch(resetReservation());
    }
  }, [reservationSuccess, updateSuccess, error, dispatch, closeModal, isUpdated]);
  
  
  return (
    <div>
      <h2>{isUpdated ? 'Update Reservation' : 'Reserve Room'}</h2>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label="Room"
          placeholder="Select a room"
          data={allRooms.map((room) => ({ value: room.id.toString(), label: room.name }))}
          {...form.getInputProps('room_id')}
        />
        
        <TextInput 
          label="Title" 
          placeholder="Title" 
          {...form.getInputProps('title')} 
        />
        
        <DateInput 
          label="Date" 
          placeholder="Pick a date" 
          value={form.values.date} 
          onChange={(date) => form.setFieldValue('date', date)}
          error={form.errors.date}
        />
        
        <TimeInput 
          label="Start Time" 
          {...form.getInputProps('start_time')} 
          min="08:00" 
          max="18:00" 
        />
        
        <TimeInput 
          label="End Time" 
          {...form.getInputProps('end_time')} 
          min="08:00" 
          max="18:00" 
        />

        <Textarea 
          label="Description" 
          placeholder="Description" 
          {...form.getInputProps('description')} 
        />
        <MultiSelect
          label="User"
          placeholder="Select a user"
          data={allUsers?.map((user) => ({ value: user.id.toString(), label: user.name }))}
          {...form.getInputProps('participants')}
        />
        <Button type="submit" style ={{ marginTop: '5%' }}>{isUpdated ? 'Update' : 'Submit'}</Button>
      </form>
    </div>
  );
};

export default ReserveRoom;