import connectDB from "@/lib/db"
import Portfolio from "@/models/Portfolio"
import { getServerSession } from "next-auth"

export async function PATCH(req) {
  await connectDB()
  const session = await getServerSession()
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const { heroTemplate } = await req.json()
  if (!["hero1", "hero2", "hero3"].includes(heroTemplate)) {
    return new Response(JSON.stringify({ error: "Invalid template" }), { status: 400 })
  }

  const portfolio = await Portfolio.findOneAndUpdate(
    { user: session.user.id },
    { heroTemplate },
    { new: true }
  )

  return new Response(JSON.stringify({ heroTemplate: portfolio.heroTemplate }), { status: 200 })
} 