import ConnectDB from "@/utils/ConnectDB";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Connect to the database
      await ConnectDB();

      // Fetch all users along with their todos
      const users = await User.find();

      // Return the users as JSON
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  } else {
    // Handle invalid HTTP methods
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
