import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

export function useCatalogDndSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );
}
