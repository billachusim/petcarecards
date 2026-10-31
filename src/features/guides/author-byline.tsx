import { Link } from "@tanstack/react-router";

import { AUTHOR, AUTHOR_PHOTO, AUTHOR_PHOTO_ALT } from "@/features/guides/author";

/** "By Bill Achusim" byline with the author photo, linking to /about#author. */
export function AuthorByline({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/about"
      hash="author"
      className={`inline-flex items-center gap-2.5 rounded-full transition-colors hover:text-foreground ${className}`}
    >
      <img
        src={AUTHOR_PHOTO}
        alt={AUTHOR_PHOTO_ALT}
        width={32}
        height={32}
        loading="lazy"
        className="size-8 rounded-full object-cover"
      />
      <span className="font-medium">By {AUTHOR}</span>
    </Link>
  );
}
