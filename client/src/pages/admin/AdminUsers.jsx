import { useState, useEffect } from "react";
import { Search, UserCheck, UserX, Mail, Calendar } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock users data
    setUsers([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "customer",
        status: "active",
        joinDate: "2024-01-10",
        orders: 5,
        totalSpent: 45999
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "customer",
        status: "active",
        joinDate: "2024-01-08",
        orders: 12,
        totalSpent: 125999
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        role: "customer",
        status: "inactive",
        joinDate: "2024-01-05",
        orders: 2,
        totalSpent: 15999
      },
      {
        id: 4,
        name: "Alice Brown",
        email: "alice@example.com",
        role: "admin",
        status: "active",
        joinDate: "2023-12-01",
        orders: 0,
        totalSpent: 0
      }
    ]);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
        <p className="text-muted-foreground">Manage customer accounts and permissions</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-bold text-foreground">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-xl font-bold text-foreground">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <UserX className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive Users</p>
                <p className="text-xl font-bold text-foreground">
                  {users.filter(u => u.status === 'inactive').length}
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-xl font-bold text-foreground">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-foreground">User</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Role</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Total Spent</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Join Date</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-secondary/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-semibold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-600' 
                        : 'bg-blue-500/20 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-500/20 text-green-600' 
                        : 'bg-red-500/20 text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground">{user.orders}</td>
                  <td className="py-3 px-4 text-foreground">₹{user.totalSpent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-foreground flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {user.joinDate}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        user.status === 'active'
                          ? 'bg-red-500/20 text-red-600 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-600 hover:bg-green-500/30'
                      }`}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
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

export default AdminUsers;