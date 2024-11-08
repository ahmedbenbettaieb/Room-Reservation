import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/config/AxiosInstance';
import { format } from 'date-fns';
import { ReservationEvent } from '@/types/evenType';

// Define the initial state for the reservation slice
const initialState = {
  loading: false,
  error: null as string | null,
  success: false,
  events: [] as ReservationEvent[],
  reservationSuccess: false,
  updateSuccess: false,
};

export const formatDateAndHour = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

// Create an async thunk for making a reservation
export const reserveRoom = createAsyncThunk(
  'reservation/reserveRoom',
  async (values: any, { rejectWithValue }) => {
    const meetingDate = formatDateAndHour(new Date(values.date));
    const startDateTime = `${meetingDate} ${values.start_time}:00`;
    const endDateTime = `${meetingDate} ${values.end_time}:00`;

    const formattedValues = {
      ...values,
      start_date: startDateTime,
      end_date: endDateTime,
      status: 'confirmed',
    };

    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.post('/event/reserve-room', formattedValues, { headers });
      return response.data; 
    } catch (error: any) {

      if (error.response && error.response.status === 409) {
        return rejectWithValue("Room Already Reserved , Please Select Another Room or Time");
      }


      return rejectWithValue(error.response?.data || 'Reservation failed'); // Handle errors
    }
  }
);

export const updateEvent = createAsyncThunk(
  'reservation/updateEvent',
  async ({ eventId, values }: { eventId: number; values: any }, { rejectWithValue }) => {
    const meetingDate = formatDateAndHour(new Date(values.date));
    const startDateTime = `${meetingDate} ${values.start_time}:00`;
    const endDateTime = `${meetingDate} ${values.end_time}:00`;

    const formattedValues = {
      ...values,
      start_date: startDateTime,
      end_date: endDateTime,
    };
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axiosInstance.put(`/event/update-event/${eventId}`, formattedValues, { headers });
      return response.data; 
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        return rejectWithValue("Room Already Reserved , Please Select Another Room or Time");
      }
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);
export const getEvents = createAsyncThunk(
  'reservation/getEvents',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axiosInstance.get('event/get-all-events', { headers });
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to get events');
    }
  }
)


// Create a slice for reservation
export const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    resetReservation: (state) => {
      state.loading = false;
      state.error = null;
      state.reservationSuccess = false;
      state.updateSuccess = false;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(reserveRoom.pending, (state) => {
        state.loading = true;
        state.reservationSuccess = false;
        state.error = null;
      })
      .addCase(reserveRoom.fulfilled, (state) => {
        state.loading = false;
        state.reservationSuccess = true; 
        state.error = null;
      })
      .addCase(reserveRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true; 
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true; 
        state.error = null;
        state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


  },
});

export const { resetReservation } = reservationSlice.actions;
export default reservationSlice.reducer; 
