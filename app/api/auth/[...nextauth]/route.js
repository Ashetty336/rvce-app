import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        try {
          await dbConnect();
          
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log("No user found with email:", credentials.email);
            throw new Error("Invalid credentials");
          }

          console.log("Comparing passwords for user:", user.email);
          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log("Password comparison result:", isValid);
          
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.username
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 