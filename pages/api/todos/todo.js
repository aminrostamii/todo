import ConnectDB from "@/utils/ConnectDB";
import mongoose from "mongoose";
import { addTodoToUser } from "@/utils/todoHelper";

export default async function handler(req, res) {
  await ConnectDB(); // Ensure database connection
  console.log("Received request:", req.method, req.body);

  if (req.method === "POST") {
    try {
      const { description, priority, status,userId } = req.body;
      
      // Retrieve userId from cookies

      if (!userId) {
        return res.status(400).json({ message: "User ID is missing in cookies" });
      }

      // Validate userId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId format" });
      }

      // Validate required fields
      if (!description || !priority || !status) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Add todo to user
      const newTodo = await addTodoToUser(userId, description, priority, status);

      return res.status(201).json({ message: "Task added successfully", todo: newTodo });
    } catch (error) {
      console.error("Error saving todo:", error);
      return res.status(500).json({ message: "Failed to save task" });
    }
  } else {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
