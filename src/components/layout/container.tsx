import { cn } from "@/lib/cn";

export function Container({
  className,
  narrow,
  children,
}: {
  className?: string;
  narrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 lg:px-10",
        narrow ? "max-w-narrow" : "max-w-content",
        className
      )}
    >
      {children}
    </div>
  );
}
