import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaUndo, FaTrashAlt, FaEdit, FaSave } from "react-icons/fa";

const TodoCard = ({ todo, onToggleStatus, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.description);

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(todo._id, editedText);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      key={todo._id}
      className="bg-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-row-reverse justify-between items-center gap-4">
        {/* وضعیت */}
        <div className="text-sm text-white whitespace-nowrap">
          وضعیت:{" "}
          <span
            className={`font-bold ${
              todo.status === "done" ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {todo.status === "done" ? "انجام شده" : "در انتظار"}
          </span>
        </div>

        {/* متن تسک یا فیلد ویرایش */}
        <div className="flex-1 min-w-[200px]">
          {isEditing ? (
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full bg-gray-900 text-white text-sm px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-inner placeholder-gray-400"
              placeholder="ویرایش تسک..."
            />
          ) : (
            <span className="text-white text-base font-semibold break-words">
              {todo.description}
            </span>
          )}
        </div>
      </div>

      {/* دکمه‌ها */}
      <div className="flex justify-between items-center mt-5 flex-wrap gap-4">
        <motion.button
          onClick={() => onToggleStatus(todo._id, todo.status)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white shadow-md ${
            todo.status === "done"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          } transition-all duration-300`}
          whileHover={{ scale: 1.05 }}
        >
          {todo.status === "done" ? (
            <>
              <FaUndo />
              بازگشت به انتظار
            </>
          ) : (
            <>
              <FaCheckCircle />
              انجام
            </>
          )}
        </motion.button>

        <div className="flex items-center gap-4">
          {isEditing ? (
            <motion.button
              onClick={handleSave}
              className="flex items-center gap-1 text-green-400 hover:text-green-500 text-sm transition"
              whileHover={{ scale: 1.1 }}
            >
              <FaSave />
              ذخیره
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-500 text-sm transition"
              whileHover={{ scale: 1.1 }}
            >
              <FaEdit />
              ویرایش
            </motion.button>
          )}

          <motion.button
            onClick={() => onDelete(todo._id)}
            className="flex items-center gap-1 text-red-400 hover:text-red-600 text-sm transition"
            whileHover={{ scale: 1.1 }}
          >
            <FaTrashAlt />
            حذف
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoCard;
