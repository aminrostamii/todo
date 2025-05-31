import User from "@/models/User";

export async function addTodoToUser(userId, description, priority, status) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const newTodo = { description, priority, status };
    user.todos.push(newTodo);
    await user.save();
    return newTodo;
  }
  