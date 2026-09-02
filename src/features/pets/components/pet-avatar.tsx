import { PawPrint } from "lucide-react";

import type { Pet } from "../models";

export function PetAvatar({ pet, size = 56 }: { pet: Pet; size?: number }) {
  const style = { width: size, height: size };
  if (pet.photoDataUrl) {
    return (
      <img
        src={pet.photoDataUrl}
        alt={`Photo of ${pet.name}`}
        style={style}
        className="shrink-0 rounded-2xl object-cover"
      />
    );
  }
  return (
    <div
      style={style}
      className="flex shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
      aria-hidden="true"
    >
      <PawPrint style={{ width: size * 0.42, height: size * 0.42 }} />
    </div>
  );
}
