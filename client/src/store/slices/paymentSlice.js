import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

/* ================= INITIATE PAYMENT ================= */
export const initiatePayment = createAsyncThunk(
  "payment/initiate",
  async ({ amount, productName, transactionId, method, orderId }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/payment/initiate", {
        amount,
        productName,
        transactionId,
        method,
        orderId,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Payment initiation failed"
      );
    }
  }
);

/* ================= VERIFY ESEWA PAYMENT ================= */
export const verifyEsewaPayment = createAsyncThunk(
  "payment/verifyEsewa",
  async ({ oid, amt, refId }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/payment/esewa/verify", {
        oid,
        amt,
        refId,
      });
      toast.success("eSewa payment verified successfully!");
      return response.data;
    } catch (error) {
      toast.error("eSewa payment verification failed!");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "eSewa payment verification failed"
      );
    }
  }
);

/* ================= VERIFY KHALTI PAYMENT ================= */
export const verifyKhaltiPayment = createAsyncThunk(
  "payment/verifyKhalti",
  async ({ pidx, orderId }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/payment/khalti/verify", {
        pidx,
        orderId,
      });
      toast.success("Khalti payment verified successfully!");
      return response.data;
    } catch (error) {
      toast.error("Khalti payment verification failed!");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Khalti payment verification failed"
      );
    }
  }
);

/* ================= PAYMENT SLICE ================= */
const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    processing: false,
    paymentMethod: "esewa",
    paymentStatus: "idle",
    error: null,
    esewaConfig: null,
    khaltiPaymentUrl: null,
    transactionId: null,
  },
  reducers: {
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    resetPaymentState: (state) => {
      state.loading = false;
      state.processing = false;
      state.paymentStatus = "idle";
      state.error = null;
      state.esewaConfig = null;
      state.khaltiPaymentUrl = null;
      state.transactionId = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------- INITIATE PAYMENT -------- */
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.esewaConfig) {
          state.esewaConfig = action.payload.esewaConfig;
        }
        if (action.payload.khaltiPaymentUrl) {
          state.khaltiPaymentUrl = action.payload.khaltiPaymentUrl;
        }
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- VERIFY ESEWA PAYMENT -------- */
      .addCase(verifyEsewaPayment.pending, (state) => {
        state.processing = true;
        state.paymentStatus = "processing";
      })
      .addCase(verifyEsewaPayment.fulfilled, (state) => {
        state.processing = false;
        state.paymentStatus = "succeeded";
      })
      .addCase(verifyEsewaPayment.rejected, (state, action) => {
        state.processing = false;
        state.paymentStatus = "failed";
        state.error = action.payload;
      })

      /* -------- VERIFY KHALTI PAYMENT -------- */
      .addCase(verifyKhaltiPayment.pending, (state) => {
        state.processing = true;
        state.paymentStatus = "processing";
      })
      .addCase(verifyKhaltiPayment.fulfilled, (state) => {
        state.processing = false;
        state.paymentStatus = "succeeded";
      })
      .addCase(verifyKhaltiPayment.rejected, (state, action) => {
        state.processing = false;
        state.paymentStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setPaymentMethod, resetPaymentState, setPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;