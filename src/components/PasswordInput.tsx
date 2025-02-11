import React, { ChangeEventHandler, useState } from "react";
import { Input } from "./ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "./ui/button";

function PasswordInput({
  value,
  onChange,
  placeholder,
  id,
  name,
  disabled,
  ...props
}: {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        disabled={disabled}
        {...props}
      />
      <Button
        type="button"
        disabled={disabled}
        variant="secondary"
        className="absolute right-0 top-0"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <Eye /> : <EyeClosed />}
      </Button>
    </div>
  );
}

export default PasswordInput;
