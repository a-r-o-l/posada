"use client";

import { Profile } from "@/supabase/models/profile";
import { createContext, useContext } from "react";

const UserContext = createContext<Profile | null>(null);

export function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Profile;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const user = useContext(UserContext);
  if (!user) throw new Error("useUser must be used within UserProvider");
  return user;
}
