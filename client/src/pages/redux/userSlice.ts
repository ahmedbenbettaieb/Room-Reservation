import axiosInstance from "@/config/AxiosInstance";
import { UserInfoTypes } from "@/types/userType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


type InitialStateTypes = {
  user: UserInfoTypes | null;
  error: string | null;
  loading: boolean;
};

const initialState: InitialStateTypes = {
  user: null,
  error: null,
  loading: false,
};

// Fetch user data with createAsyncThunk
export const getUserData = createAsyncThunk<UserInfoTypes, void>(
  "user/getUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);


export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfoTypes | null>) => {
      state.user = action.payload;
    },

    resetUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser , resetUser } = userSlice.actions;

export default userSlice.reducer;
