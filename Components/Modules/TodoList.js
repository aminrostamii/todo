import TodoCard from "./TodoItem";
import { motion } from "framer-motion";

const TodoList = ({ title, todos, onToggleStatus, onDelete, onEdit }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <h2 className="text-2xl text-indigo-500 font-bold mb-4">{title}</h2>
      {todos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <p className="text-white">{title === "تسک‌های در انتظار" ? "تسکی برای نمایش وجود ندارد." : "تسک انجام شده‌ای وجود ندارد."}</p>
      )}
    </motion.div>
  );
};

export default TodoList;
