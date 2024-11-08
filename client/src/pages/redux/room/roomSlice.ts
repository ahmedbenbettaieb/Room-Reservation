import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/config/AxiosInstance';
import { RoomType } from '@/types/roomType';
import axios from 'axios';

const initialState={
    loading:false,
    error:null as string | null,
    success:false,
    rooms : [] as RoomType[],
    createSuccess:false,
    updateSuccess:false,
}

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (values: any, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axiosInstance.post('/room/add-room', values, { headers });
      return response.data; 
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        return rejectWithValue("Room Already Reserved , Please Select Another Room or Time");
      }
      return rejectWithValue(error.response?.data || 'Create failed');
    }
  }
);

export const getRooms = createAsyncThunk(
  'room/getRooms',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axiosInstance.get('/room/get-rooms', { headers });
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to get rooms');
    }
  }
)
export const updateRoom = createAsyncThunk(
    'room/updateRoom',
    async({ roomId, values }: { roomId: number; values: any },{rejectWithValue})=>{
        const token=localStorage.getItem('token')
        const headers={
            Authorization: `Bearer ${token}`,
        }
        try {
            const response=await axiosInstance.put(`/room/update-room/${roomId}`,values,{headers})	
            return response.data
            
        } catch (error:any) {
            if (error.response ) {
                return rejectWithValue("an error occured");
              }
            return rejectWithValue(error.response?.data || 'Update failed');
            
        }
    }
)

export const deleteRoom = createAsyncThunk(
    'room/deleteRoom',
    async(roomId: number,{rejectWithValue})=>{
        const token=localStorage.getItem('token')
        const headers={
            Authorization: `Bearer ${token}`,
        }
        try {
            const response=await axiosInstance.delete(`/room/delete-room/${roomId}`,{headers})	
            return response.data
            
        } catch (error:any) {
            if (error.response ) {
                return rejectWithValue("an error occured");
              }
            return rejectWithValue(error.response?.data || 'Update failed');
            
        }
    }
)

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    resetRoom: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.createSuccess = false;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.createSuccess = false;
        state.updateSuccess = false;
      })
      .addCase(createRoom.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.createSuccess = true;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.createSuccess = false;
        state.updateSuccess = false;
      })
      .addCase(getRooms.fulfilled, (state, action: PayloadAction<RoomType[]>) => {
        state.loading = false;  
        state.rooms = action.payload;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null; 
        state.success = false;
        state.createSuccess = false;
        state.updateSuccess = false;
      })
      .addCase(updateRoom.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.updateSuccess = true;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;  
        state.error = action.payload as string;
      })
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.createSuccess = false;
        state.updateSuccess = false;
      })
      .addCase(deleteRoom.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetRoom } = roomSlice.actions;

export default roomSlice.reducer;


