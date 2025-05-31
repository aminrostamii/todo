import Link from "next/link";
import { FaTasks, FaUser, FaBars, FaHeadset, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

const Aside = ({ setActiveSection, activeSection, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <aside className="bg-gray-800 text-white w-64 p-4 lg:block hidden h-screen flex-col justify-between">
      {/* Hamburger Icon for small screens */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <button onClick={toggleSidebar} className="text-white p-2 rounded-md">
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`lg:block ${isSidebarOpen ? "block" : "hidden"} lg:space-y-2`}>
        <ul className="space-y-2">
          <li>
            <Link
              href="/todo"
              onClick={() => setActiveSection("todo")}
              className={`flex items-center w-full text-left p-2 rounded ${
                activeSection === "todo" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <FaTasks className="mr-2 ml-2" />
              وظایف
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              onClick={() => setActiveSection("profile")}
              className={`flex items-center w-full text-left p-2 rounded ${
                activeSection === "profile" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <FaUser className="mr-2 ml-2" />
              پروفایل
            </Link>
          </li>
          <li>
            <Link
              href="/support"
              onClick={() => setActiveSection("support")}
              className={`flex items-center w-full text-left p-2 rounded ${
                activeSection === "support" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <FaHeadset className="mr-2 ml-2" />
              پشتیبانی
            </Link>
          </li>
        </ul>
      </div>

      {/* Logout Button */}
      <div className="mt-4">
        <button
          onClick={onLogout}
          className="flex items-center w-full text-left p-2 rounded bg-red-600 text-white"
        >
          <FaSignOutAlt className="mr-2 ml-2" />
          خروج
        </button>
      </div>
    </aside>
  );
};

export default Aside;
