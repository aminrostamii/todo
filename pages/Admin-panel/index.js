import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const AdminPanel = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [todoState, setTodoState] = useState({
    description: "",
    priority: "medium",
  });

  const [authorized, setAuthorized] = useState(null); // null for loading state

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    try {
      const response = await axios.get("/api/auth/roleChecking");
      if (response.data.role === "admin") {
        setAuthorized(true);
        fetchUsers();
      } else {
        setAuthorized(false);
        router.push("/unauthorized"); // or show a message instead
      }
    } catch (error) {
      console.error("Role check failed:", error);
      setAuthorized(false);
      router.push("/unauthorized");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/panel/users");
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const saveUser = async () => {
    try {
      if (selectedUser) {
        await axios.put(`/api/users/${selectedUser._id}`, formState);
      } else {
        await axios.post("/api/users", formState);
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const resetForm = () => {
    setFormState({ fullName: "", email: "", phone: "" });
    setSelectedUser(null);
  };

  const addTodo = async () => {
    try {
      await axios.post(`/api/users/${selectedUser._id}/todos`, todoState);
      fetchUsers();
      setTodoState({ description: "", priority: "medium" });
    } catch (error) {
      console.error("Error adding to-do:", error);
    }
  };

  const deleteTodo = async (userId, todoId) => {
    try {
      await axios.delete(`/api/users/${userId}/todos/${todoId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting to-do:", error);
    }
  };

  if (authorized === null || loading)
    return <div className="text-center text-gray-300">Loading...</div>;

  if (authorized === false)
    return (
      <div className="text-center text-red-500 mt-10 text-lg">
        You are not authorized to view this page.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

        {/* User Form */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedUser ? "Edit User" : "Add User"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveUser();
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={formState.fullName}
              onChange={(e) =>
                setFormState({ ...formState, fullName: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formState.email}
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone"
              value={formState.phone}
              onChange={(e) =>
                setFormState({ ...formState, phone: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {selectedUser ? "Update" : "Add"} User
              </button>
              {selectedUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* User List */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-2 text-left">Name</th>
                <th className="border-b border-gray-700 p-2 text-left">Email</th>
                <th className="border-b border-gray-700 p-2 text-left">Phone</th>
                <th className="border-b border-gray-700 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700">
                  <td className="p-2">{user.fullName}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.phone}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* To-Do Management */}
        {selectedUser && (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Manage To-Dos for {selectedUser.fullName}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTodo();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="To-Do Description"
                value={todoState.description}
                onChange={(e) =>
                  setTodoState({ ...todoState, description: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={todoState.priority}
                onChange={(e) =>
                  setTodoState({ ...todoState, priority: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add To-Do
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
