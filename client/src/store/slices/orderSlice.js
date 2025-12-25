import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

/* =========================
   FETCH MY ORDERS
========================= */
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/orders/my");
      return data.myOrders || data.orders || data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch orders"
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

/* =========================
   PLACE ORDER
========================= */
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/orders/new", orderData);
      toast.success("Order placed successfully");
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Order placement failed"
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

/* =========================
   ORDER SLICE
========================= */
const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
  },
  reducers: {
    toggleOrderStep: (state) => {
      state.orderStep = 1;
    },
    clearOrders: (state) => {
      state.myOrders = [];
    },
  },
  extraReducers: (builder) => {
    /* Fetch Orders */
    builder.addCase(fetchMyOrders.pending, (state) => {
      state.fetchingOrders = true;
    });
    builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
      state.fetchingOrders = false;
      state.myOrders = action.payload;
    });
    builder.addCase(fetchMyOrders.rejected, (state) => {
      state.fetchingOrders = false;
    });

    /* Place Order */
    builder.addCase(placeOrder.pending, (state) => {
      state.placingOrder = true;
    });
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.placingOrder = false;
      state.finalPrice = action.payload.total_price;
      state.paymentIntent = action.payload.paymentIntent;
      state.orderStep = 2;
    });
    builder.addCase(placeOrder.rejected, (state) => {
      state.placingOrder = false;
    });
  },
});

export default orderSlice.reducer;
export const { toggleOrderStep, clearOrders } = orderSlice.actions;
