// allUsersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/config/AxiosInstance";
import { UserInfoTypes } from "@/types/userType";

type AllUsersState = {
  allUsers: UserInfoTypes[] | null;
  loading: boolean;
  error: string | null;
  success: boolean|null;
};

const initialState: AllUsersState = {
  allUsers: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunk to fetch all users
export const fetchAllUsers = createAsyncThunk<UserInfoTypes[], void>(
  "allUsers/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("auth/get-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching all users:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "allUsers/createUser",
  async (values: any, { rejectWithValue }) => {
    try {
      const headers= {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
      const response = await axiosInstance.post("/auth/create-user", values, { headers });
      return response.data;
    } catch (error: any) {
      console.error("Error creating user:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create user"
      );
    }
  }
)

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    setAllUsers: (state, action: PayloadAction<UserInfoTypes[]>) => {
      state.allUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<UserInfoTypes[]>) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;

      }).
      addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true; 
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { setAllUsers } = allUsersSlice.actions;
export const allUsersReducer = allUsersSlice.reducer; 
export default allUsersSlice;
