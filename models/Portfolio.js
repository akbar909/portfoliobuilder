import mongoose from "mongoose"

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  github: {
    type: String,
  },
  technologies: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
})


const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  theme: {
    type: String,
    enum: ["light", "dark", "system"],
    default: "light",
  },
  heroType: {
    type: String,
    enum: ["text", "image"],
    default: "text",
  },
  heroTitle: {
    type: String,
    default: "Welcome to my Portfolio",
  },
  heroSubtitle: {
    type: String,
    default: "I build things for the web",
  },
  heroImage: {
    type: String,
  },
  // About section fields
  aboutDescription: {
    type: String,
    default: "I am a developer passionate about building web applications.",
  },
  aboutProfileImage: {
    type: String,
  },
  aboutTitle: {
    type: String,
    default: "Full Stack Developer",
  },
  aboutLocation: {
    type: String,
  },
  aboutBio: {
    type: String,
  },
  skills: [
    {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    }
  ],
  
  // Projects section with improved schema
  projects: [ProjectSchema],
  contact: {
    email: String,
    linkedin: String,
    github: String,
    twitter: String,
  },
  customizations: {
    primaryColor: {
      type: String,
      default: "#3b82f6",
    },
    fontFamily: {
      type: String,
      default: "Inter",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema)
