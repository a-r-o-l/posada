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

// https://www.mercadopago.com.ar/checkout/v1/payment/redirect/9e5a5b2d-a910-4f6b-9106-44dcb31b5f8e/review/?preference-id=77404456-e70d7f1e-0739-4653-a5ec-5c6e0a8e5f36&router-request-id=7075079c-75c2-413d-93c7-3c7a20940a75&p=225cd0e3f69622d699cd36381e3256a7

// https://fotosposada.com.ar/store/cart/checkout?collection_id=156519181999&collection_status=approved&payment_id=156519181999&status=approved&external_reference=796513783769&payment_type=account_money&merchant_order_id=40475935642&preference_id=77404456-e70d7f1e-0739-4653-a5ec-5c6e0a8e5f36&site_id=MLA&processing_mode=aggregator&merchant_account_id=null
