import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import { addToCart } from "../store/slices/cartSlice";
import { fetchProductDetails } from "../store/slices/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = useSelector((state) => state.product?.productDetails);
  const { loading, productReviews } = useSelector((state) => state.product);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  // ✅ FIX 1: return added
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground">
            The product you're looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <div>
              <div className="glass-card p-4 mb-4">
                {product.images ? (
                  <img
                    src={product.images[selectedImage]?.url}
                    alt={product.name}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                ) : (
                  <div className="glass-card min-h-[418px] p-4 mb-4 animate-pulse" />
                )}
              </div>

              <div className="flex space-x-2">
                {product.images &&
                  product.images.map((img, index) => (
                    <button
                      key={index}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="mb-4">
                <div className="flex space-x-2 mb-4">
                  {new Date() - new Date(product.created_at) <
                    30 * 24 * 60 * 60 * 1000 && (
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                      NEW
                    </span>
                  )}

                  {product.rating >= 4.5 && (
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-xs font-semibold rounded">
                      TOP RATED
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
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
                  </div>

                  <span className="text-foreground font-medium">
                    {product.ratings}
                  </span>

                  {/* ✅ FIX 2: length typo */}
                  <span className="text-muted-foreground">
                    ({productReviews?.length || 0}) reviews
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-2xl font-bold text-primary">
                  ${product.price}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-muted-foreground">
                  category: {product.category}
                </span>
                <span>
                  {product.stock > 5 ? (
                    <span className="text-green-600 font-semibold">
                      In Stock
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="text-yellow-600 font-semibold">
                      Limited Stock
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Out of Stock
                    </span>
                  )}
                </span>
              </div>
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-lg font-medium">Quantity:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 glass-card hover:glow-on-hover animate-smooth"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 glass-card hover:glow-on-hover animate-smooth"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex items-center justify-center space-x-2 py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    disabled={product.stock === 0}
                    className="py-3 bg-secondary text-foreground border border-border rounded-lg hover:bg-accent animate-smooth font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary animate-smooth">
                    <Heart className="w-5 h-5" />
                    <span>Add to Wishlist</span>
                  </button>
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary animate-smooth">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

            </div>
            
          </div>
             <div className="glass-panel">
            <div className="flex border-b border-[hsla(var(--glass-border))]">
              {["description", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize transition-all ${
                    activeTab === tab
                      ? "text-primary border-b-2"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "reviews" && (
              <ReviewsContainer
              product={product}
                productReviews={productReviews}
                />

            )}
          </div>
          
          
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
