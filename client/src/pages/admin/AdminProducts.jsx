import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { fetchProducts } from "../../store/slices/productSlice";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ category: "", price: "0-200000", search: "", ratings: "", availability: "", page: 1 }));
  }, [dispatch]);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{product.category}</td>
                    <td className="py-3 px-4 text-foreground">₹{Number(product.price).toFixed(2)}</td>
                    <td className="py-3 px-4 text-foreground">{product.stock}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 
                          ? 'bg-green-500/20 text-green-600' 
                          : 'bg-red-500/20 text-red-600'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-600/20 rounded-lg transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-600/20 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;