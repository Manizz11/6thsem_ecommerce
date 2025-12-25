import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Eye } from "lucide-react";
import { fetchProducts } from "../../store/slices/productSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    dispatch(fetchProducts({ category: "", price: "0-200000", search: "", ratings: "", availability: "", page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    setStats({
      totalUsers: 150,
      totalProducts: products?.length || 0,
      totalOrders: 45,
      totalRevenue: 125000
    });
  }, [products]);

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-500" },
    { title: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-green-500" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "bg-yellow-500" },
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-purple-500" }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your e-commerce admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm">New order #1234</span>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm">Product added: iPhone 15</span>
              <span className="text-xs text-muted-foreground">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm">User registered: john@example.com</span>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
              Add New Product
            </button>
            <button className="w-full p-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition">
              View All Orders
            </button>
            <button className="w-full p-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;