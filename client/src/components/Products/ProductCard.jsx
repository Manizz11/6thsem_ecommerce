import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
    const handleAddToCart = (product, e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(addToCart(product));
      toast.success(`${product.name} added to cart!`);
    };
  return <>
  <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="glass-card hover:glow-on-hover animate-smooth group"
          >
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={product.images?.[0]?.url || product.images?.[0] || "https://via.placeholder.com/300x200?text=Product"}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />

              {/* NEW badge */}
              {Date.now() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
                <span className="absolute top-3 left-3 text-xs">NEW</span>
              )}

              {/* Add to cart */}
              <button
                onClick={(e) => handleAddToCart(product, e)}
                disabled={product.stock === 0}
                className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                <ShoppingCart className="w-5 h-5 text-gray-800" />
              </button>
            </div>

            <h3 className="text-lg font-semibold">{product.name}</h3>

            {/* Ratings */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < Math.floor(product.ratings)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="ml-2 text-sm">
                ({product.review_count})
              </span>
            </div>
           {/* Price */}
            <div>
              <span className="text-xl font-bold text-primary">
                ₹{product?.price ? Number(product.price).toFixed(2) : '0.00'}
              </span>
            </div>
            
            {/* Stock */}
            <span className={`
              text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                product.stock > 5
                  ? "bg-green-500/20 text-green-600"
                : product.stock > 0
                  ? "bg-yellow-500/20 text-yellow-600"
                  : "bg-red-500/20 text-red-600"
              }
            `}>
              {product.stock > 5
                ? "In Stock"
                : product.stock > 0
                ? "Limited Stock"
                : "Out of Stock"}
            </span>
          </Link></>;
};

export default ProductCard;
