import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import dbConnect from "@/lib/mongoose";
import CredentialsProvider from "next-auth/providers/credentials";
import Account, { IAccount } from "./models/Account";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(dbConnect),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect();
        const foundAccount: IAccount | null = await Account.findOne({
          email: credentials?.email,
        });
        if (!foundAccount) {
          throw new Error("Cuenta no encontrada.");
        }

        if (foundAccount.password !== credentials?.password) {
          throw new Error("password o nombre de usuario invalido.");
        }
        return {
          id: foundAccount._id.toString(),
          name: foundAccount.name,
          lastname: foundAccount.lastname,
          email: foundAccount.email,
          role: foundAccount.role,
          children: foundAccount.children,
          password: foundAccount.password,
          imageUrl: foundAccount.imageUrl,
          verified: foundAccount.verified,
          availableGrades: foundAccount.availableGrades,
          schoolId: foundAccount.schoolId,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async jwt(token, user) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        token.role = user.role;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        token.imageUrl = user.imageUrl;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async session(session, token) {
      if (token) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        session.user.id = token.id;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        session.user.role = token.role;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        session.user.imageUrl = token.imageUrl;
        session.token = token;
      }
      return session;
    },
  },
  trustHost: true,
});
