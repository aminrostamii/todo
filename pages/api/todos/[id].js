import ConnectDB from "@/utils/ConnectDB";
import User from "@/models/User";
import { parse } from "cookie";

export default async function handler(req, res) {
  const { id } = req.query;
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const userId = cookies.userId;

  await ConnectDB();

  if (!userId || !id) {
    return res.status(400).json({ message: "User ID and Todo ID are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const todo = user.todos.find((t) => t._id.toString() === id);
    if (!todo) return res.status(404).json({ message: "Todo not found." });

    if (req.method === "DELETE") {
      user.todos = user.todos.filter((t) => t._id.toString() !== id);
      await user.save();
      return res.status(200).json({ message: "Todo deleted successfully." });

    } else if (req.method === "PATCH") {
      const { description, status } = req.body;

      const updates = {};

      // اعتبارسنجی description
      if (description !== undefined) {
        if (typeof description !== "string" || description.trim() === "") {
          return res.status(400).json({ message: "Invalid description." });
        }
        updates.description = description.trim();
      }

      // اعتبارسنجی status
      if (status !== undefined) {
        const allowedStatuses = ["pending", "done"];
        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({ message: "Invalid status. Must be 'pending' or 'done'." });
        }
        updates.status = status;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No fields to update." });
      }

      // بروزرسانی فیلدها
      Object.assign(todo, updates);
      await user.save();

      return res.status(200).json({ message: "Todo updated successfully.", todo });

    } else {
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (err) {
    console.error("Error in /api/todos/[id]:", err);
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
}
