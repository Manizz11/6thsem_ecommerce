import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAIModal } from "./popupSlice";

/* ================= FETCH PRODUCTS ================= */
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (
    {
      availability = "",
      price = "0-10000",
      category = "",
      ratings = 0,
      search = "",
      page = 1,
    },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams();
      if (availability) params.append("availability", availability);
      if (price) params.append("price", price);
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (ratings > 0) params.append("ratings", ratings);
      if (page) params.append("page", page);

      const res = await axiosInstance.get(`/product?${params.toString()}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

/* ================= PRODUCT DETAILS ================= */
export const fetchProductDetails = createAsyncThunk(
  "product/singleProduct",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/product/singleProduct/${id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

/* ================= AI SEARCH ================= */
export const fetchProductWithAI = createAsyncThunk(
  "product/ai-search",
  async (userPrompt, thunkAPI) => {
    try {
      const prompt = typeof userPrompt === "string" ? userPrompt : userPrompt?.userPrompt || userPrompt?.prompt;
      const res = await axiosInstance.post(`/product/ai-search`, { userPrompt: prompt });
      thunkAPI.dispatch(toggleAIModal());
      return res.data;
    } catch (error) {
      toast.error("AI search failed");
      return thunkAPI.rejectWithValue("AI search failed");
    }
  }
);

/* ================= DELETE REVIEW ================= */
export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async ({ productId }, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/product/delete/review/${productId}`);
      toast.success("Review deleted successfully");
      // server returns deleted review in res.data.review (with id)
      const deletedId = res.data?.review?.id || res.data?.review?.review_id || res.data?.review?.reviewId;
      return { reviewId: deletedId };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

/* ================= POST REVIEW ================= */
export const postReview = createAsyncThunk(
  "product/postReview",
  async ({ productId, review }, thunkAPI) => {
    try {
      // server expects PUT to /post-new/review/:productId
      const res = await axiosInstance.put(`/product/post-new/review/${productId}`, review);
      toast.success("Review posted successfully");
      // server responds with review and updated product
      return res.data?.review || res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post review");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to post review"
      );
    }
  }
);

/* ================= SLICE ================= */
const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    error: null,
    products: [],
    totalProducts: 0,
    productDetails: {},
    productReviews: [],
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isPostingReview: false,
    isReviewDeleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* -------- FETCH PRODUCTS -------- */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
        state.topRatedProducts = action.payload.topRatedProducts || [];
        state.newProducts = action.payload.newProducts || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- PRODUCT DETAILS -------- */
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload.product || {};
        // product reviews are nested on the returned product (product.reviews)
        state.productReviews = action.payload.product?.reviews || [];
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.loading = false;
      })

      /* -------- AI SEARCH -------- */
      .addCase(fetchProductWithAI.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(fetchProductWithAI.fulfilled, (state, action) => {
        state.aiSearching = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.products?.length || 0;
      })
      .addCase(fetchProductWithAI.rejected, (state) => {
        state.aiSearching = false;
      })

      /* -------- DELETE REVIEW -------- */
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        const id = action.payload?.reviewId;
        if (id) {
          state.productReviews = state.productReviews.filter((review) => {
            const rid = review.review_id || review.id || review._id;
            return rid !== id;
          });
        }
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isReviewDeleting = false;
      })

      /* -------- POST REVIEW -------- */
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        // action.payload may be the created review (db row) or a nested object
        const review = action.payload;
        // normalize id to review_id if needed
        if (review) {
          const normalized = {
            review_id: review.review_id || review.id || review._id,
            rating: review.rating,
            comment: review.comment,
            user_id: review.user_id || review.userId || review.user?.id,
            user_name: review.user_name || review.user?.name || review.user?.fullName,
            created_at: review.created_at || review.createdAt,
          };
          state.productReviews.push(normalized);
        }
      })
      .addCase(postReview.rejected, (state) => {
        state.isPostingReview = false;
      });
  },
});

/* ================= EXPORTS ================= */
// All thunks are exported at declaration; reducer is default
export default productSlice.reducer;
