import { motion } from "framer-motion";

const ModalAddTodo = ({ newTodo, setNewTodo, onClose, onAdd }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-2xl text-white mb-6">افزودن تسک جدید</h2>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="توصیف تسک"
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white"
        />
        <div className="flex justify-between">
          <motion.button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-3 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            بستن
          </motion.button>
          <motion.button
            onClick={onAdd}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            افزودن
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddTodo;
