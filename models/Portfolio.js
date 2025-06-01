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
  type: {
    type: String,
    enum: ["development", "design", "other"],
    default: "development",
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

const ExperienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
  },
})

const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
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
    default: "Welcome to my personal space on the internet",
  },
  heroImage: {
    type: String,
  },
  heroTemplate: {
    type: String,
    enum: ["hero1", "hero2", "hero3"],
    default: "hero1",
  },
  // About section fields
  aboutDescription: {
    type: String,
    default: "I am passionate about sharing my work and connecting with others through this platform..",
  },
  aboutProfileImage: {
    type: String,
  },
  aboutTitle: {
    type: String,
    default: "Creative Individual",
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
  experiences: [ExperienceSchema],
  education: [EducationSchema],

})

export default mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema)
