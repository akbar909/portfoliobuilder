import connectDB from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB()

        const user = await User.findOne({ email: credentials?.email })

        if (!user) {
          throw new Error("No user found with this email")
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordMatch) {
          throw new Error("Invalid password")
        }

        if (!user.verified) {
          throw new Error("UNVERIFIED_USER")
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.username = user.username
        token.role = user.role
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      // Always fetch the latest user data from the database for up-to-date session
      if (token?.id) {
        await connectDB();
        const user = await User.findById(token.id).lean();
        if (user) {
          session.user.id = user._id.toString();
          session.user.name = user.name;
          session.user.username = user.username;
          session.user.role = user.role;
          session.user.image = user.image;
          session.user.email = user.email;
        } else {
          // fallback to token if user not found
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.username = token.username;
          session.user.role = token.role;
          session.user.image = token.image;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
