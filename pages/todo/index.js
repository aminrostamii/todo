import Cookies from "js-cookie";
import { useState } from "react";
import Swal from "sweetalert2";
import useSWR, { mutate } from "swr";
import { motion } from "framer-motion";

import ModalAddTodo from "@/Components/Modules/TodoFormModal";
import TodoList from "@/Components/Modules/TodoList";
import axios from "axios";

const fetcher = (url) => fetch(url).then((res) => res.json());

const TodoPage = () => {
  const [newTodo, setNewTodo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = Cookies.get("Access_Token");
  const userId = Cookies.get("userId");

  const { data, error, isLoading } = useSWR("/api/todos/showTodo", fetcher);
  const todos = data?.todos || [];


  if (error) {
    Swal.fire("خطا", error.message, "error");
  }

  if (isLoading) {
    return (
      <div className="bg-gray-950 w-full h-full flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleAddTodo = async () => {
    if (!newTodo.trim()) {
      Swal.fire("خطا", "توصیف تسک نمی‌تواند خالی باشد!", "error");
      return;
    }

    if (!userId) {
      Swal.fire("خطا", "شناسه کاربری یافت نشد!", "error");
      return;
    }

    try {
      const response = await fetch("/api/todos/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          description: newTodo,
          priority: "medium",
          status: "pending",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save todo");

      mutate("/api/todos/showTodo");
      setNewTodo("");
      setIsModalOpen(false);
      Swal.fire("موفق", "تسک با موفقیت افزوده شد.", "success");
    } catch (error) {
      Swal.fire("خطا", error.message, "error");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "آیا مطمئن هستید؟",
        text: "این عمل قابل بازگشت نیست!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "بله، حذف کن!",
        cancelButtonText: "لغو",
      });

      if (!confirmResult.isConfirmed) return;

      if (!userId) {
        Swal.fire("خطا", "شناسه کاربری یافت نشد!", "error");
        return;
      }

      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("حذف تسک با شکست مواجه شد!");

      mutate("/api/todos/showTodo");
      Swal.fire("حذف موفق", "تسک با موفقیت حذف شد.", "success");
    } catch (error) {
      Swal.fire("خطا", error.message, "error");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      if (!userId) {
        Swal.fire("خطا", "شناسه کاربری یافت نشد!", "error");
        return;
      }

      const newStatus = currentStatus === "done" ? "pending" : "done";

      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update todo");
      }

      mutate("/api/todos/showTodo");

      Swal.fire(
        "موفق",
        currentStatus === "done"
          ? "تسک به حالت انتظار برگشت."
          : "تسک به حالت انجام شده تغییر یافت.",
        "success"
      );
    } catch (error) {
      Swal.fire("خطا", error.message, "error");
    }
  };

  const onEditHandler = async (id, newDescription) => {
    try {
      if (!userId) {
        Swal.fire("خطا", "شناسه کاربری یافت نشد!", "error");
        return;
      }

      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, description: newDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ویرایش تسک با شکست مواجه شد.");
      }

      mutate("/api/todos/showTodo");
      Swal.fire("موفق", "تسک با موفقیت ویرایش شد.", "success");
    } catch (error) {
      Swal.fire("خطا", error.message, "error");
    }
  };

  const handleSendTodosEmail = async () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) throw new Error("اطلاعات کاربر یافت نشد.");

    const user = JSON.parse(userStr);
    const email = user.email;

    const response = await axios.get("/api/todos/showTodo");
    const data = response.data;
    if (!response.status === 200) throw new Error(data.message || "خطا در دریافت تسک‌ها");

    const todosToSend = data.todos || [];

    if (todosToSend.length === 0) {
      Swal.fire("اطلاع", "تسکی برای ارسال وجود ندارد.", "info");
      return;
    }

    // درخواست ارسال ایمیل
    const emailResponse = await fetch("/api/auth/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        todos: todosToSend,
      }),
    });

    if (!emailResponse.ok) {
      const errData = await emailResponse.json();
      throw new Error(errData.message || "خطا در ارسال ایمیل");
    }

    Swal.fire("موفق", "تسک‌ها به ایمیل شما ارسال شد.", "success");
  } catch (error) {
    Swal.fire("خطا", error.message, "error");
  }
};



  const todosPending = todos.filter((todo) => todo.status === "pending");
  const todosDone = todos.filter((todo) => todo.status === "done");

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white mx-auto w-full">
      <div className="flex flex-row items-center justify-between">
        <motion.h1
          className="text-4xl font-bold text-indigo-500 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          لیست کارهای من
        </motion.h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-8 bg-indigo-600 px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          افزودن تسک جدید
        </button>
      </div>

      {/* Reminder Section */}
     <div className="mb-10 flex items-center gap-4">
        <button onClick={handleSendTodosEmail}
          className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
               ارسال تسک‌ها به ایمیل
            </button>
    </div>
      {/* Todo Lists */}
      <TodoList
        title="تسک‌های در انتظار"
        todos={todosPending}
        onDelete={handleDeleteTodo}
        onToggleStatus={handleToggleStatus}
        onEdit={onEditHandler}
      />

        <div className="my-14 border-t border-indigo-600/40" />

      <TodoList
        title="تسک‌های انجام شده"
        todos={todosDone}
        onDelete={handleDeleteTodo}
        onToggleStatus={handleToggleStatus}
        onEdit={onEditHandler}
      />

      {/* Modal for Add Todo */}
      {isModalOpen && (
        <ModalAddTodo
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddTodo}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
        />
      )}
    </div>
  );
};

export default TodoPage;
