import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaTasks, FaUser } from "react-icons/fa";
import { useRouter } from "next/router";
const Cookies = require("js-cookie");

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState("/");

  const Router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const signOutHandler = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        Cookies.remove("Access_Token");
        localStorage.removeItem("user");
        Cookies.remove("userId");
        // console.log("Signed out successfully");
        Router.push("/"); // Redirect to home page
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error signing out:", error);
      alert("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    setIsClient(true);
    const token = Cookies.get("Access_Token");
    setAccessToken(token);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <header className="bg-gray-900 text-gray-200 p-4 shadow-lg rtl border-b-2 border-gray-700">
      {/* موبایل/تبلت (نمایش منو همبرگر) */}
      <div className="flex justify-between items-center lg:hidden">
        <h1 className="text-2xl font-bold text-gradient tracking-wide">
          <span className="text-blue-600">T</span>
          odix
        </h1>
        {/* دکمه همبرگر سمت چپ */}
        <button
          onClick={toggleMenu}
          className="text-gray-200 text-2xl focus:outline-none"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* نام سایت سمت راست */}
        
      </div>

      {/* دسکتاپ مود: فقط نام سایت و دکمه ورود/خروج */}
      <div className="hidden lg:flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gradient tracking-wide">
          <span className="text-blue-600">T</span>
          odix
        </h1>
        {!Cookies.get("Access_Token") ? (
          <Link
            href="/register"
            className="bg-gradient-to-br from-indigo-600 to-blue-800 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:opacity-90 transition duration-200"
          >
            حساب کاربری
          </Link>
        ) : (
          <div className="flex flex-row gap-5">
          <button
            onClick={signOutHandler}
            className="rounded-2xl bg-red-600 px-4 py-2 leading-none text-white"
          >
            خروج
          </button>
           <Link
            href="/todo"
            className="bg-gradient-to-br from-indigo-600 to-blue-800 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:opacity-90 transition duration-200"
          >
           پنل کاربری
          </Link>
          </div>
        )}
      </div>

      {/* منوی کشویی در موبایل/تبلت */}
      <nav
        className={`fixed top-19 right-0 w-full h-full bg-gray-900 p-6 transform transition-transform duration-300 lg:hidden z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="space-y-4 rtl text-right">
          <li>
            <Link
              href="/"
              onClick={() => {
                setActiveSection("/");
                setIsMenuOpen(false);
              }}
              className={`flex items-center w-full p-2 rounded ${
                activeSection === "/"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <FaTasks className="ml-2" /> وظایف
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              onClick={() => {
                setActiveSection("Profile");
                setIsMenuOpen(false);
              }}
              className={`flex items-center w-full p-2 rounded ${
                activeSection === "Profile"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <FaUser className="ml-2" /> پروفایل
            </Link>
          </li>
          <li>
            {!accessToken ? (
              <Link
                href="/register"
                className="block bg-gradient-to-br from-indigo-600 to-blue-800 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:opacity-90 transition duration-200 text-center"
              >
                حساب کاربری
              </Link>
            ) : (
              <button
                onClick={signOutHandler}
                className="w-full bg-red-600 text-white font-bold px-4 py-2 rounded-full text-center"
              >
                خروج
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
