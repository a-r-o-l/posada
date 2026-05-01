import React from "react";
import AdminDashboard from "./components/AdminDashboardClient";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <AdminDashboard />
    </div>
  );
}
