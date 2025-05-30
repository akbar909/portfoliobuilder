import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    minlength: [3, "Username must be at least 3 characters"],
    match: [/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and dashes"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "superadmin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
