"use client";
import React, { createContext, useContext } from "react";

interface User {
  id: string;
  name: string;
  role: string;
  password: string;
  imageUrl: string;
}

interface UserContextType {
  user: User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
  user: User | undefined;
  children: React.ReactNode;
}> = ({ user, children }) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
