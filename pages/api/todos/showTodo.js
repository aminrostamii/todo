import ConnectDB from "@/utils/ConnectDB";
import { parse } from "cookie"; // Make sure the 'cookie' package is installed
import User from "@/models/User"; // Mongoose model for users

export default async function handler(req, res) {
  if (req.method === "GET") {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const userId = cookies.userId; // Get userId from cookies
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required in cookies" });
    }

    try {
      // Ensure database connection using ConnectDB (assuming it connects using Mongoose)
      await ConnectDB();

      // Fetch the user by userId using Mongoose
      const user = await User.findById(userId); // Mongoose query to find user by ID
      console.log(user);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Extract todos from the user
      const todos = user.todos || [];

      res.status(200).json({ todos });
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
