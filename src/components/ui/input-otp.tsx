
import React, { forwardRef } from "react";
import { OTPInput, OTPInputProps } from "input-otp";
import { cn } from "@/lib/utils";

const InputOTP = forwardRef<HTMLInputElement, OTPInputProps>((props, ref) => {
  return <OTPInput ref={ref} maxLength={6} {...props} />;
});
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
});
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { filled?: boolean }
>(({ className, filled, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-10 w-10 rounded-md border bg-background text-center text-sm shadow-sm transition-all",
        filled ? "border-primary" : "border-input",
        className
      )}
      {...props}
    />
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };
