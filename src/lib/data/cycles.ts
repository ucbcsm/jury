import { Cycle } from "@/types";

export const cyclesLMD: Omit<Cycle, "id">[] = [
  {
    name: "Licence",
    symbol: "L",
    planned_credits: 180,
    planned_years: 3,
    planned_semester: 6,
    purpose: "Acquérir les bases fondamentales d'une discipline.",
    order_number: 1,
  },
  {
    name: "Master",
    symbol: "M",
    planned_credits: 120,
    planned_years: 2,
    planned_semester: 4,
    purpose:
      "Approfondir les connaissances et préparer à la recherche ou à la professionnalisation.",
    order_number: 2,
  },
  {
    name: "Doctorat",
    symbol: "D",
    planned_credits: 180,
    planned_years: 3,
    planned_semester: 6,
    purpose: "Contribuer à la recherche scientifique avec une thèse originale.",
    order_number: 3,
  },
];

export const getCyclesLMDAsOptions = ()=> cyclesLMD.map((cycle) => {
  return { value: cycle.name, label: cycle.name };
});
export const getCyclesLMDAsOptionsWithDisabled = (currentCycles?: Cycle[]) =>
  cyclesLMD.map((cycle) => {
    const isDisabled = currentCycles?.some((currentCycle) => currentCycle.name === cycle.name);
    return { value: cycle.name, label: cycle.name, disabled: isDisabled };
  });

export const getCycleLMD = (name: "Licence" | "Master" | "Doctorat") =>
  cyclesLMD.find((cycle) => cycle.name === name);
