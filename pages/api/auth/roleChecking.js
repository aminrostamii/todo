import ConnectDB from "@/utils/ConnectDB";
import User from "@/models/User";

export default async function handler(req, res) {
  await ConnectDB();

  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ message: "User ID not found in cookies" });
  }

  try {
    const user = await User.findById(userId).select("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ role: user.role });
  } catch (err) {
    console.error("Error checking role:", err);
    res.status(500).json({ message: "Server error" });
  }
}
