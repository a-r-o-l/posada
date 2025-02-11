import * as React from "react";

import { cn } from "@/lib/utils";
import { CircleCheck, Loader2 } from "lucide-react";

interface LoadingInputProps extends React.ComponentProps<"input"> {
  loading?: boolean;
  condition?: boolean;
  error?: boolean;
}

const LoadingInput = React.forwardRef<HTMLInputElement, LoadingInputProps>(
  ({ error, condition, loading, value, className, type, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
            !loading &&
              condition &&
              !!value &&
              "border-green-500 focus-visible:ring-black",
            !!error && "border-red-900 focus-visible:ring-black"
          )}
          value={value}
          ref={ref}
          {...props}
        />
        {loading && !!value && (
          <Loader2 className="absolute right-2 top-2 animate-spin text-blue-500" />
        )}
        {!loading && condition && !!value && (
          <CircleCheck className="absolute right-2 top-2 text-green-500" />
        )}
      </div>
    );
  }
);
LoadingInput.displayName = "LoadingInput";

export { LoadingInput };
