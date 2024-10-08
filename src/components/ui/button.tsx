import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-300",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-zinc-50 shadow hover:bg-blue-700/90 dark:bg-black dark:text-gray-50 dark:hover:bg-zinc-50/90",
        analytics:
          "bg-blue-500 text-zinc-50 shadow hover:bg-blue-700/90 dark:bg-black dark:text-gray-50 dark:hover:bg-zinc-50/90 dark:border-zinc-600 dark:shadow-[4px_4px_4px_rgba(255,255,255,0.2)]",
        reset:
          "bg-red-500 text-zinc-50 shadow-sm hover:bg-red-700/90 dark:bg-red-800 dark:text-zinc-50 dark:hover:bg-red-900/90",
        add: "bg-green-500 dark:bg-green-800 dark:hover:bg-green-900 text-zinc-50 shadow-sm hover:bg-green-700/90 dark:text-zinc-50 ",
        outline:
          "border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:border-zinc-600 dark:shadow-[4px_4px_4px_rgba(255,255,255,0.2)]",
        secondary:
          "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        header:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 text-lg",
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
        timerGhost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:text-black dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
      },
      size: {
        default: "h-9 px-4 py-2",
        header: " px-0 py-0",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
