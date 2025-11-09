import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse-color rounded-md bg-surface bg-opacity-50", className)}
      {...props}
    />
  );
}

export { Skeleton };
