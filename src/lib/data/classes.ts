import { Class } from "@/types";

type classLMD = Omit<Class, "id" | "cycle"> & {
  cycle_name: "Licence" | "Master" | "Doctorat";
};

export const classesLMD: classLMD[] = [
  {
    name: "Année préparatoire",
    acronym: "L0",
    order_number: 0,
    description:
      "Année de mise à niveau pour préparer l'entrée en L1. Ne fait pas partie du cycle Licence officiel.",
    cycle_name:"Licence"
  },
  {
    name: "Licence 1",
    acronym: "L1",
    order_number: 1,
    description:
      "Première année du cycle Licence, introduction aux bases de la discipline.",
      cycle_name:"Licence"
  },
  {
    name: "Licence 2",
    acronym: "L2",
    order_number: 2,
    description:
      "Deuxième année du cycle Licence, approfondissement des fondamentaux.",
      cycle_name:"Licence"
  },
  {
    name: "Licence 3",
    acronym: "L3",
    order_number: 3,
    description:
      "Troisième année du cycle Licence, consolidation des compétences et orientation vers le Master ou le marché du travail.",
      cycle_name:"Licence"
  },
  {
    name: "Master 1",
    acronym: "M1",
    order_number: 1,
    description:
      "Première année du Master, spécialisation et début de la formation avancée.",
      cycle_name:"Master"
  },
  {
    name: "Master 2",
    acronym: "M2",
    order_number: 2,
    description:
      "Deuxième année du Master, perfectionnement, projet de recherche ou professionnel.",
      cycle_name:"Master"
  },
  {
    name: "Doctorat 1",
    acronym: "D1",
    order_number: 1,
    description:
      "Première année du Doctorat, début des travaux de recherche sous encadrement.",
      cycle_name:"Doctorat"
  },
  {
    name: "Doctorat 2",
    acronym: "D2",
    order_number: 2,
    description:
      "Deuxième année du Doctorat, approfondissement de la recherche et rédaction partielle.",
      cycle_name:"Doctorat"
  },
  {
    name: "Doctorat 3",
    acronym: "D3",
    order_number: 3,
    description:
      "Troisième année du Doctorat, finalisation de la thèse et soutenance.",
      cycle_name:"Doctorat"
  },
];

export const getClassesAsOptions = classesLMD.map((classItem) => {
  return { value: classItem.name, label: classItem.name };
});

export const getClassesAsOptionsWithDisabled = (
  currentClasses?: { name: string }[]
) =>
  classesLMD.map((classItem) => {
    const isDisabled = currentClasses?.some(
      (currentClass) => currentClass.name === classItem.name
    );
    return {
      value: classItem.name,
      label: classItem.name,
      disabled: isDisabled,
    };
  });

export const getClassesByCycleAsOptionsWithDisabled = (
  cycle: "Licence" | "Master" | "Doctorat",
  currentClasses?: Class[]
) =>
  classesLMD
    .filter((classItem) => {
      if (cycle === "Licence" && classItem.cycle_name === "Licence")
        return classItem.order_number >= 0 && classItem.order_number <= 3;
      if (cycle === "Master" && classItem.cycle_name === "Master")
        return classItem.order_number >= 1 && classItem.order_number <= 2;
      if (cycle === "Doctorat" && classItem.cycle_name === "Doctorat")
        return classItem.order_number >= 1 && classItem.order_number <= 3;
      return false;
    })
    .map((classItem) => {
      const isDisabled = currentClasses?.some(
        (currentClass) => currentClass.name === classItem.name
      );
      return {
        value: classItem.name,
        label: classItem.name,
        disabled: isDisabled,
      };
    });

export const getClass = (name: string) =>
  classesLMD.find((classItem) => classItem.name === name);
