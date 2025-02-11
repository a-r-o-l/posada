import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import React from "react";

function LoadingButton({
  loading,
  disabled,
  title,
  classname,
  type = "button",
  variant = "default",
  onClick = () => {},
  children,
}: {
  loading?: boolean;
  disabled?: boolean;
  title: string;
  classname?: string;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
  onClick?: () => void;
}) {
  return (
    <Button
      className={classname}
      type={type}
      disabled={loading || disabled}
      variant={variant}
      onClick={onClick}
    >
      {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
      {children}
      <p>{title}</p>
    </Button>
  );
}

export default LoadingButton;
