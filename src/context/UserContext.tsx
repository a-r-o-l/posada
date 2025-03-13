"use client";
import React, { createContext, useContext } from "react";

export interface IUser {
  id: string;
  name: string;
  lastname: string;
  role: string;
  password: string;
  imageUrl: string;
  availableGrades: string[];
  children: string[];
  verified: boolean;
  email: string;
  phone: string;
}

interface UserContextType {
  user: IUser | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
  user: IUser | undefined;
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
