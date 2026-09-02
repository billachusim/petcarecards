import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearPetData,
  emptyDatabase,
  loadDatabase,
  saveDatabase,
  stamp,
  type CareDatabase,
} from "../data/care-data-repository";
import type {
  CareCard,
  CareRoutine,
  CaregiverInfo,
  EmergencyContact,
  FeedingSchedule,
  Medication,
  Pet,
  PremiumEntitlement,
  Reminder,
  Veterinarian,
} from "../models";
import { nowIso } from "@/lib/storage/local-store";

interface CareStoreValue {
  ready: boolean;
  db: CareDatabase;
  isPremium: boolean;
  pets: Pet[];
  getPet: (id: string) => Pet | undefined;
  buildCareCard: (petId: string) => CareCard | undefined;
  addPet: (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => Pet;
  updatePet: (id: string, changes: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  feedingsFor: (petId: string) => FeedingSchedule[];
  saveFeeding: (feeding: Partial<FeedingSchedule> & { petId: string }) => void;
  deleteFeeding: (id: string) => void;
  routineFor: (petId: string) => CareRoutine | undefined;
  saveRoutine: (petId: string, changes: Partial<CareRoutine>) => void;
  medicationsFor: (petId: string) => Medication[];
  saveMedication: (med: Partial<Medication> & { petId: string; name: string }) => void;
  deleteMedication: (id: string) => void;
  emergencyFor: (petId: string) => EmergencyContact | undefined;
  saveEmergency: (petId: string, changes: Partial<EmergencyContact>) => void;
  vetFor: (petId: string) => Veterinarian | undefined;
  saveVet: (petId: string, changes: Partial<Veterinarian>) => void;
  reminders: Reminder[];
  remindersFor: (petId: string) => Reminder[];
  saveReminder: (reminder: Partial<Reminder> & { petId: string; title: string; time: string }) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string, enabled: boolean) => void;
  caregiver: CaregiverInfo;
  saveCaregiver: (info: CaregiverInfo) => void;
  setEntitlement: (entitlement: PremiumEntitlement) => void;
  deleteAllData: () => void;
  exportData: () => string;
}

const CareStoreContext = createContext<CareStoreValue | null>(null);

export function CareStoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<CareDatabase>(emptyDatabase);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDb(loadDatabase());
    setReady(true);
  }, []);

  const commit = useCallback((updater: (current: CareDatabase) => CareDatabase) => {
    setDb((current) => {
      const next = updater(current);
      saveDatabase(next);
      return next;
    });
  }, []);

  const value = useMemo<CareStoreValue>(() => {
    const touch = <T extends { updatedAt: string }>(record: T): T => ({
      ...record,
      updatedAt: nowIso(),
    });

    return {
      ready,
      db,
      isPremium: db.premium.lifetimeUnlocked,
      pets: db.pets,
      getPet: (id) => db.pets.find((p) => p.id === id),
      buildCareCard: (petId) => {
        const pet = db.pets.find((p) => p.id === petId);
        if (!pet) return undefined;
        return {
          pet,
          feedings: db.feedings.filter((f) => f.petId === petId),
          routine: db.routines.find((r) => r.petId === petId),
          medications: db.medications.filter((m) => m.petId === petId),
          emergency: db.emergency.find((e) => e.petId === petId),
          veterinarian: db.vets.find((v) => v.petId === petId),
          generatedAt: nowIso(),
        };
      },
      addPet: (pet) => {
        const created = stamp<Pet>(pet);
        commit((c) => ({ ...c, pets: [...c.pets, created] }));
        return created;
      },
      updatePet: (id, changes) =>
        commit((c) => ({
          ...c,
          pets: c.pets.map((p) => (p.id === id ? touch({ ...p, ...changes }) : p)),
        })),
      deletePet: (id) =>
        commit((c) => ({
          ...c,
          pets: c.pets.filter((p) => p.id !== id),
          feedings: c.feedings.filter((f) => f.petId !== id),
          routines: c.routines.filter((r) => r.petId !== id),
          medications: c.medications.filter((m) => m.petId !== id),
          emergency: c.emergency.filter((e) => e.petId !== id),
          vets: c.vets.filter((v) => v.petId !== id),
          reminders: c.reminders.filter((r) => r.petId !== id),
        })),
      feedingsFor: (petId) => db.feedings.filter((f) => f.petId === petId),
      saveFeeding: (feeding) =>
        commit((c) => {
          const existing = feeding.id && c.feedings.find((f) => f.id === feeding.id);
          if (existing) {
            return {
              ...c,
              feedings: c.feedings.map((f) =>
                f.id === feeding.id ? touch({ ...f, ...feeding }) : f,
              ),
            };
          }
          return { ...c, feedings: [...c.feedings, stamp<FeedingSchedule>(feeding as never)] };
        }),
      deleteFeeding: (id) =>
        commit((c) => ({ ...c, feedings: c.feedings.filter((f) => f.id !== id) })),
      routineFor: (petId) => db.routines.find((r) => r.petId === petId),
      saveRoutine: (petId, changes) =>
        commit((c) => {
          const existing = c.routines.find((r) => r.petId === petId);
          if (existing) {
            return {
              ...c,
              routines: c.routines.map((r) =>
                r.petId === petId ? touch({ ...r, ...changes }) : r,
              ),
            };
          }
          return { ...c, routines: [...c.routines, stamp<CareRoutine>({ petId, ...changes })] };
        }),
      medicationsFor: (petId) => db.medications.filter((m) => m.petId === petId),
      saveMedication: (med) =>
        commit((c) => {
          const existing = med.id && c.medications.find((m) => m.id === med.id);
          if (existing) {
            return {
              ...c,
              medications: c.medications.map((m) =>
                m.id === med.id ? touch({ ...m, ...med }) : m,
              ),
            };
          }
          return { ...c, medications: [...c.medications, stamp<Medication>(med as never)] };
        }),
      deleteMedication: (id) =>
        commit((c) => ({ ...c, medications: c.medications.filter((m) => m.id !== id) })),
      emergencyFor: (petId) => db.emergency.find((e) => e.petId === petId),
      saveEmergency: (petId, changes) =>
        commit((c) => {
          const existing = c.emergency.find((e) => e.petId === petId);
          if (existing) {
            return {
              ...c,
              emergency: c.emergency.map((e) =>
                e.petId === petId ? touch({ ...e, ...changes }) : e,
              ),
            };
          }
          return {
            ...c,
            emergency: [...c.emergency, stamp<EmergencyContact>({ petId, ...changes })],
          };
        }),
      vetFor: (petId) => db.vets.find((v) => v.petId === petId),
      saveVet: (petId, changes) =>
        commit((c) => {
          const existing = c.vets.find((v) => v.petId === petId);
          if (existing) {
            return {
              ...c,
              vets: c.vets.map((v) => (v.petId === petId ? touch({ ...v, ...changes }) : v)),
            };
          }
          return { ...c, vets: [...c.vets, stamp<Veterinarian>({ petId, ...changes })] };
        }),
      reminders: db.reminders,
      remindersFor: (petId) => db.reminders.filter((r) => r.petId === petId),
      saveReminder: (reminder) =>
        commit((c) => {
          const existing = reminder.id && c.reminders.find((r) => r.id === reminder.id);
          if (existing) {
            return {
              ...c,
              reminders: c.reminders.map((r) =>
                r.id === reminder.id ? touch({ ...r, ...reminder }) : r,
              ),
            };
          }
          return {
            ...c,
            reminders: [
              ...c.reminders,
              stamp<Reminder>({
                type: "custom",
                repeat: "daily",
                enabled: true,
                ...reminder,
              } as never),
            ],
          };
        }),
      deleteReminder: (id) =>
        commit((c) => ({ ...c, reminders: c.reminders.filter((r) => r.id !== id) })),
      toggleReminder: (id, enabled) =>
        commit((c) => ({
          ...c,
          reminders: c.reminders.map((r) => (r.id === id ? touch({ ...r, enabled }) : r)),
        })),
      caregiver: db.caregiver,
      saveCaregiver: (info) => commit((c) => ({ ...c, caregiver: { ...c.caregiver, ...info } })),
      setEntitlement: (entitlement) => commit((c) => ({ ...c, premium: entitlement })),
      deleteAllData: () => {
        clearPetData();
        setDb((c) => ({ ...emptyDatabase(), premium: c.premium }));
      },
      exportData: () =>
        JSON.stringify(
          {
            exportedAt: nowIso(),
            app: "Pet Care Card",
            data: { ...db, premium: undefined },
          },
          null,
          2,
        ),
    };
  }, [db, ready, commit]);

  return <CareStoreContext.Provider value={value}>{children}</CareStoreContext.Provider>;
}

export function useCareStore(): CareStoreValue {
  const ctx = useContext(CareStoreContext);
  if (!ctx) throw new Error("useCareStore must be used inside CareStoreProvider");
  return ctx;
}
