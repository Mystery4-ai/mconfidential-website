import Image from "next/image";

export function Avatar({
  src,
  name,
  size = 56,
}: {
  src?: string | null;
  name: string;
  size?: number;
}) {
  if (src) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full bg-ivory-dim"
        style={{ width: size, height: size }}
      >
        <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-charcoal text-sm font-medium text-ivory"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}
