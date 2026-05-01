"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

function LogoutButton({
  icon,
  variant,
  className,
}: {
  icon: React.ReactNode;
  variant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className: string;
}) {
  return (
    <form
      action={async () => {
        await signOut({
          redirectTo: "/signin",
        });
      }}
    >
      <Button variant={variant} className={className}>
        {icon}
        Logout
      </Button>
    </form>
  );
}

export default LogoutButton;
