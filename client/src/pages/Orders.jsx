import React, { useEffect, useState } from "react";
import {
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");

  const { myOrders = [], fetchingOrders } = useSelector((state) => state.order);
  const { authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, authUser]);

  if (!authUser) {
    navigate("/products");
    return null;
  }

  const filteredOrders = myOrders.filter(
    (order) => statusFilter === "All" || order.status === statusFilter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-400" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-400" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Package className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "Shipped":
        return "bg-blue-500/20 text-blue-400";
      case "Delivered":
        return "bg-green-500/20 text-green-400";
      case "Cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              My Orders
            </h1>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass-input px-3 py-2 rounded-md text-sm bg-transparent"
              >
                <option value="All">All</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {fetchingOrders ? (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground">
                  Loading orders...
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground">
                  You have no orders yet.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id || order._id}
                  className="glass-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  {/* Left */}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order ID
                    </p>
                    <p className="font-medium text-foreground">
                      #{order.id || order._id}
                    </p>

                    <p className="text-sm text-muted-foreground mt-2">
                      Placed on{" "}
                      {new Date(order.created_at || order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Middle */}
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.order_status || order.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.order_status || order.status
                      )}`}
                    >
                      {order.order_status || order.status}
                    </span>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Total
                    </p>
                    <p className="text-lg font-bold text-primary">
                      ${order.total_price || order.totalPrice}
                    </p>

                    <button
                      onClick={() => navigate(`/orders/${order.id || order._id}`)}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
