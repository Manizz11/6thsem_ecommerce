import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Trash2, User } from "lucide-react";
import { postReview, deleteReview } from "../../store/slices/productSlice";

const ReviewsContainer = ({ product, productReviews }) => {
  const { authUser } = useSelector((state) => state.auth);
  const { isReviewDeleting, isPostingReview } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      dispatch(postReview({
        productId: product.id,
        review: { rating, comment }
      }));
      setRating(0);
      setComment("");
      setShowReviewForm(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    // server deletes review for the authenticated user by product id
    dispatch(deleteReview({ productId: product.id }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
      
      {authUser && (
        <div className="mb-6">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border rounded-lg resize-none h-24"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isPostingReview || rating === 0 || !comment.trim()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isPostingReview ? 'Posting...' : 'Post Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setRating(0);
                    setComment("");
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="space-y-4">
        {productReviews?.length > 0 ? (
          productReviews.map((review) => (
            <div key={review.review_id} className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{review.user_name}</p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {authUser?.id === review.user_id && (
                  <button
                    onClick={() => handleDeleteReview()}
                    disabled={isReviewDeleting}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <p className="mt-2 text-gray-700">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewsContainer;
