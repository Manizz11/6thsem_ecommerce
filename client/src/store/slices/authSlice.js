import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice"; 

// ========================== REGISTER ==========================
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      toast.success(res.data.message);
      thunkAPI.dispatch(toggleAuthPopup());
      return res.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ========================== LOGIN (Changed same as REGISTER) ==========================
export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
  try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success(res.data.message);
      thunkAPI.dispatch(toggleAuthPopup());
      return res.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

// ========================== GET USER ==========================
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch user"
      );
    }
  }
);

// ========================== LOGOUT ==========================
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      thunkAPI.dispatch(toggleAuthPopup());
      return null;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch user"
      );
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgot/password",
  async (email, thunkAPI) => {
  try {
      const res = await axiosInstance.post(
        "/auth/password/forgot?frontendUrl=http://localhost:5173",
         email);
      toast.success(res.data.message);
    
      return null;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/password/reset",
  async ({ token, password, confirmPassword}, thunkAPI) => {
  try {
      const res = await axiosInstance.put(
        `/auth/password/reset${token}`,
         { 
          password, 
          confirmPassword, 
        });
      toast.success(res.data.message);
    
      return res.data.user;
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong. Please try again.");
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/password/update",
  async (data, thunkAPI) => {
  try {
      const res = await axiosInstance.put(
        `/auth/password/update`,data);
      toast.success(res.data.message);
      return null;
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong. Please try again.");
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);


export const updateProfile = createAsyncThunk(
  "auth/me/update",
  async (data, thunkAPI) => {
  try {
      const res = await axiosInstance.put(
        `/auth/profile/update`,data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong. Please try again.");
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// ========================== SLICE ==========================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {

    // REGISTER
    builder.addCase(register.pending, (state) => {
      state.isSigningUp = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isSigningUp = false;
      state.authUser = action.payload;
    });
    builder.addCase(register.rejected, (state) => {
      state.isSigningUp = false;
    });

    // LOGIN (Updated like register)
    builder.addCase(login.pending, (state) => {
      state.isLoggingIn = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggingIn = false;
      state.authUser = action.payload;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoggingIn = false;
    });

    // GET USER
    builder.addCase(getUser.pending, (state) => {
      state.isCheckingAuth = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isCheckingAuth = false;
      state.authUser = action.payload.user;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.isCheckingAuth = false;
      state.authUser = null;
    });
    // Logout


builder.addCase(logout.fulfilled, (state) => {

  state.authUser = null; 
});

builder.addCase(logout.rejected, (state) => {
  state.authUser = state.authUser ;
});

   // forgot password
builder.addCase(forgotPassword.pending, (state) => {
  state.isRequestingForToken = true;   
});

builder.addCase(forgotPassword.fulfilled, (state, action) => {
  state.isRequestingForToken = false; 
});

builder.addCase(forgotPassword.rejected, (state, action) => {
  state.isRequestingForToken = false;
});

//resetr password

builder.addCase(resetPassword.pending, (state) => {
  state.isUpdatingPassword = true;   
});

builder.addCase(resetPassword.fulfilled, (state, action) => {
  state.isUpdatingPassword = false; 
  state.authUser = action.payload;
});

builder.addCase(resetPassword.rejected, (state, action) => {
  state.isUpdatingPassword = false;
});

//update password
builder.addCase(updatePassword.pending, (state) => {
  state.isUpdatingPassword = true;   
});

builder.addCase(updatePassword.fulfilled, (state, action) => {
  state.isUpdatingPassword = false; 
});

builder.addCase(updatePassword.rejected, (state, action) => {
  state.isUpdatingPassword = false;
});

//update profile
builder.addCase(updateProfile.pending, (state) => {
  state.isUpdatingProfile = true;   
});

builder.addCase(updateProfile.fulfilled, (state, action) => {
  state.isUpdatingProfile = false; 
  state.authUser = action.payload;
});  
builder.addCase(updateProfile.rejected, (state) => {
  state.isUpdatingProfile = false;   
}); 


    
    
  },
});

export default authSlice.reducer;
