import { Camera, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { compressImageFile } from "@/lib/image";
import { firstError } from "@/lib/validation";

interface PhotoPickerProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  label?: string;
}

export function PhotoPicker({ value, onChange, label = "Photo" }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await compressImageFile(file));
    } catch (error) {
      toast.error(firstError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {value ? (
        <img src={value} alt="Selected pet photo" className="size-20 rounded-2xl object-cover" />
      ) : (
        <div className="flex size-20 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <Camera className="size-7" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label={label}
          onChange={(e) => void pick(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="secondary"
          className="h-11 rounded-xl"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Adding…" : value ? "Change photo" : "Add photo"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-xl text-muted-foreground"
            onClick={() => onChange(undefined)}
          >
            <Trash2 className="size-4" aria-hidden="true" /> Remove
          </Button>
        )}
      </div>
    </div>
  );
}
