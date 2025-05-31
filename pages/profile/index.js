import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { FaEdit, FaSignOutAlt, FaPlus, FaTrash } from 'react-icons/fa';

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [todoHistory, setTodoHistory] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    ringtone: 'Default',
    theme: 'Light',
  });
  const router = useRouter();

  useEffect(() => {
    // Check if Access_Token exists
    const accessToken = Cookies.get('Access_Token');
    if (!accessToken) {
      router.push('/register');
    }

    const storedData = localStorage.getItem('user');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }

    const storedHistory = localStorage.getItem('todoHistory');
    if (storedHistory) {
      setTodoHistory(JSON.parse(storedHistory));
    }

    const storedNotificationSettings = localStorage.getItem('notificationSettings');
    if (storedNotificationSettings) {
      setNotificationSettings(JSON.parse(storedNotificationSettings));
    }

    const storedPicture = localStorage.getItem('profilePicture');
    if (storedPicture) {
      setProfilePicture(storedPicture);
    }
  }, [router]);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = { task: newTodo, date: new Date() };
      const updatedHistory = [...todoHistory, newTodoItem];
      setTodoHistory(updatedHistory);
      localStorage.setItem('todoHistory', JSON.stringify(updatedHistory));
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedHistory = todoHistory.filter((_, i) => i !== index);
    setTodoHistory(updatedHistory);
    localStorage.setItem('todoHistory', JSON.stringify(updatedHistory));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        localStorage.setItem('profilePicture', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationSettingsChange = (event) => {
    const { name, value } = event.target;
    const updatedSettings = { ...notificationSettings, [name]: value };
    setNotificationSettings(updatedSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
  };

  const handleSignOut = () => {
    Cookies.remove('Access_Token');
    localStorage.clear();
    router.push('/register');
  };

  return (
    <div className="h-full min-w-full bg-gray-950 flex justify-center items-center py-4 px-4">
      <div className="min-w-full h-full rounded-lg shadow-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-indigo-500 p-8 text-white text-center rounded-t-lg">
          <h1 className="text-4xl font-bold">پروفایل</h1>
        </div>

        {/* Profile Info */}
        <div className="p-6 text-white">
          {userData ? (
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">

                {/* Full Name */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-600 rounded-full ml-2 flex items-center justify-center text-2xl font-semibold text-white">
                    {userData?.fullname ? userData.fullname.charAt(0) : 'U'}
                  </div>
                  <h2 className="text-3xl font-semibold text-white">{userData.fullname}</h2>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3 hover:text-indigo-400 transition duration-300">
                  <i className="text-indigo-500 fa-solid fa-envelope text-xl"></i>
                  <p className="text-gray-400">{userData.email}</p>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3 hover:text-indigo-400 transition duration-300">
                  <i className="text-indigo-500 fa-solid fa-phone text-xl"></i>
                  <p className="text-gray-400">{userData.phone}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>در حال بارگذاری...</p>
          )}
        </div>

        {/* To-Do Section */}
        <div className="p-6 text-white bg-gray-900 mt-4 m-3 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">تاریخچه انجام کارها</h2>
          {todoHistory.length > 0 ? (
            <div className="space-y-3">
              {todoHistory.map((todo, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">{todo.task}</span>
                    <span className="text-sm text-gray-500">{new Date(todo.date).toLocaleDateString()}</span>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteTodo(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">تاریخچه هیچ کاری یافت نشد.</p>
          )}
        </div>

        {/* Notification Settings */}
        <div className="p-6 text-white bg-gray-900 mt-4 m-3 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">تنظیمات اعلان‌ها</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400">صدای اعلان</label>
              <select
                name="ringtone"
                value={notificationSettings.ringtone}
                onChange={handleNotificationSettingsChange}
                className="w-full p-2 bg-gray-800 text-white rounded-lg"
              >
                <option value="Default">Default</option>
                <option value="Chime">Chime</option>
                <option value="Beep">Beep</option>
                <option value="Silent">Silent</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400">تم</label>
              <select
                name="theme"
                value={notificationSettings.theme}
                onChange={handleNotificationSettingsChange}
                className="w-full p-2 bg-gray-800 text-white rounded-lg"
              >
                <option value="Light">روشن</option>
                <option value="Dark">تیره</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-6 text-center">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition duration-300"
            onClick={handleSignOut}
          >
            <FaSignOutAlt />
            <span className="pr-2 mb-2">خروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
