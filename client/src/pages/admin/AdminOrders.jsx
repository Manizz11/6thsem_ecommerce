import { useState, useEffect } from "react";
import { Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    // Mock orders data
    setOrders([
      {
        id: "ORD001",
        customer: "John Doe",
        email: "john@example.com",
        total: 15999,
        status: "pending",
        items: 3,
        date: "2024-01-15",
        address: "123 Main St, City"
      },
      {
        id: "ORD002",
        customer: "Jane Smith",
        email: "jane@example.com",
        total: 89999,
        status: "processing",
        items: 1,
        date: "2024-01-14",
        address: "456 Oak Ave, Town"
      },
      {
        id: "ORD003",
        customer: "Bob Johnson",
        email: "bob@example.com",
        total: 45999,
        status: "shipped",
        items: 2,
        date: "2024-01-13",
        address: "789 Pine Rd, Village"
      },
      {
        id: "ORD004",
        customer: "Alice Brown",
        email: "alice@example.com",
        total: 25999,
        status: "delivered",
        items: 1,
        date: "2024-01-12",
        address: "321 Elm St, City"
      }
    ]);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Package className="w-4 h-4" />;
      case "processing": return <Package className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-600";
      case "processing": return "bg-blue-500/20 text-blue-600";
      case "shipped": return "bg-purple-500/20 text-purple-600";
      case "delivered": return "bg-green-500/20 text-green-600";
      case "cancelled": return "bg-red-500/20 text-red-600";
      default: return "bg-gray-500/20 text-gray-600";
    }
  };

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
        <p className="text-muted-foreground">Track and manage customer orders</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-foreground">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Items</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Total</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-foreground">{order.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground">{order.items} items</td>
                  <td className="py-3 px-4 text-foreground">₹{order.total.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground">{order.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-600/20 rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const newOrders = orders.map(o => 
                            o.id === order.id ? { ...o, status: e.target.value } : o
                          );
                          setOrders(newOrders);
                        }}
                        className="px-2 py-1 text-xs bg-secondary border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;