import { Search, Sparkles, Star, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";
import { categories } from "../data/products";

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isFirstRender = useRef(true);

  /* ---------------- REDUX STATE ---------------- */
  const {
    products = [],
    totalProducts = 0,
    loading,
    error,
  } = useSelector((state) => state.product);

  /* ---------------- QUERY PARAMS ---------------- */
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get("search") || "";
  const searchedCategory = query.get("category") || "";

  /* ---------------- LOCAL STATE ---------------- */
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState(searchedCategory);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRatings, setSelectedRatings] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  /* -------- RESET PAGE WHEN FILTERS CHANGE -------- */
  useEffect(() => {
    if (!isFirstRender.current) {
      setCurrentPage(1);
    }
  }, [
    selectedCategory,
    searchQuery,
    priceRange,
    selectedRatings,
    availability,
  ]);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    isFirstRender.current = false;

    dispatch(
      fetchProducts({
        category: selectedCategory,
        price: `${priceRange[0]}-${priceRange[1]}`,
        search: searchQuery,
        ratings: selectedRatings,
        availability,
        page: currentPage,
      })
    );
  }, [
    dispatch,
    selectedCategory,
    priceRange,
    searchQuery,
    selectedRatings,
    availability,
    currentPage,
  ]);

  const totalPages = Math.ceil(totalProducts / 10);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden mb-4 p-3 glass-card flex items-center gap-2"
          >
            <Filter className="w-6 h-6" />
            <span>Filters</span>
          </button>

          {/* Sidebar Filters */}
          <div
            className={`lg:block ${
              isMobileFilterOpen ? "block" : "hidden"
            } w-full lg:w-80 space-y-6`}
          >
            <div className="glass-panel">
              <h2 className="text-xl font-semibold mb-6">Filters</h2>

              {/* Price */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Ratings</h3>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setSelectedRatings(
                        selectedRatings === rating ? 0 : rating
                      )
                    }
                    className={`flex gap-2 w-full p-2 rounded ${
                      selectedRatings === rating
                        ? "bg-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </button>
                ))}
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Availability</h3>
                {["in-stock", "limited", "out-of-stock"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setAvailability(
                        availability === status ? "" : status
                      )
                    }
                    className={`w-full p-2 text-left rounded ${
                      availability === status
                        ? "bg-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {status.replace("-", " ").toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Category */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Category</h3>
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full p-2 rounded ${
                    selectedCategory === ""
                      ? "bg-primary/20"
                      : "hover:bg-secondary"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full p-2 rounded ${
                      selectedCategory === category.name
                        ? "bg-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-8 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 py-3 rounded-lg"
                />
              </div>

              <button
                onClick={() => dispatch(toggleAIModal())}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white flex gap-2"
              >
                <Sparkles className="w-5 h-5" />
                AI Search
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                Loading products...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center py-20">
                <p className="text-red-500">Error: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-primary text-white rounded"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Debug Info */}
            {!loading && (
              <div className="mb-4 text-sm text-gray-500">
                Found {products.length} products (Total: {totalProducts})
              </div>
            )}

            {/* Products */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && products.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">
                No products found.
              </p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>

        <AISearchModal />
      </div>
    </div>
  );
};

export default Products;
