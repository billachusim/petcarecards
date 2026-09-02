import { Plus, Trash2 } from "lucide-react";

import { TextField } from "@/components/app/form-field";
import { Button } from "@/components/ui/button";
import { useCareStore } from "@/features/pets/hooks/use-care-store";

export function FeedingStep({ petId }: { petId: string }) {
  const { feedingsFor, saveFeeding, deleteFeeding } = useCareStore();
  const feedings = feedingsFor(petId);

  return (
    <div className="space-y-4">
      {feedings.length === 0 && (
        <p className="rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
          Add what your pet eats, how much, and when. You can add more than one meal plan.
        </p>
      )}

      {feedings.map((feeding, index) => (
        <div key={feeding.id} className="space-y-4 rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">
              {feeding.foodName || `Feeding ${index + 1}`}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground"
              aria-label={`Remove feeding ${index + 1}`}
              onClick={() => deleteFeeding(feeding.id)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <TextField
            label="Food name or type"
            optional
            value={feeding.foodName ?? ""}
            onChange={(foodName) => saveFeeding({ ...feeding, foodName })}
          />
          <TextField
            label="Amount"
            optional
            value={feeding.amount ?? ""}
            onChange={(amount) => saveFeeding({ ...feeding, amount })}
            placeholder="e.g. 1 cup"
          />
          <TextField
            label="Feeding times"
            optional
            value={feeding.times ?? ""}
            onChange={(times) => saveFeeding({ ...feeding, times })}
            placeholder="e.g. 7:30 am and 6:00 pm"
          />
          <TextField
            label="Number of meals"
            optional
            value={feeding.mealsPerDay ?? ""}
            onChange={(mealsPerDay) => saveFeeding({ ...feeding, mealsPerDay })}
            placeholder="e.g. 2"
          />
          <TextField
            label="Treat instructions"
            optional
            multiline
            value={feeding.treats ?? ""}
            onChange={(treats) => saveFeeding({ ...feeding, treats })}
          />
          <TextField
            label="Foods to avoid"
            optional
            multiline
            value={feeding.foodsToAvoid ?? ""}
            onChange={(foodsToAvoid) => saveFeeding({ ...feeding, foodsToAvoid })}
          />
          <TextField
            label="Notes"
            optional
            multiline
            value={feeding.notes ?? ""}
            onChange={(notes) => saveFeeding({ ...feeding, notes })}
          />
        </div>
      ))}

      <Button
        variant="outline"
        className="h-12 w-full rounded-xl"
        onClick={() => saveFeeding({ petId })}
      >
        <Plus className="size-4" aria-hidden="true" /> Add feeding
      </Button>
    </div>
  );
}
