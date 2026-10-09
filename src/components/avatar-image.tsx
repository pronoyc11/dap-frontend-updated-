import Image from "next/image";

type AvatarImageProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

/**
 * User-uploaded images are served by the configured backend/storage provider.
 * They are intentionally unoptimized until the storage host is configured in
 * next.config.ts; intrinsic dimensions still prevent avatar layout shifts.
 */
export function AvatarImage({ src, alt, size = 64, className }: AvatarImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      loader={({ src: imageSource }) => imageSource}
      unoptimized
      className={className}
    />
  );
}
