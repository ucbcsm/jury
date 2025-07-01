import { Currency } from "@/types";

export const availableCurrencies: Omit<Currency, "id" | "enabled">[] = [
  {
    name: "Dollar américain",
    iso_code: "USD",
    symbol: "$",
  },
  {
    name: "Franc congolais",
    iso_code: "CDF",
    symbol: "Fr",
  },
];

export const getCurrenciesAsOptions = availableCurrencies.map((currency) => {
  return { value: currency.name, label: currency.name };
});

export const getCurrenciesAsOptionsWithDisabled = (currentCycles?: Currency[]) =>
  availableCurrencies.map((currency) => {
    const isDisabled = currentCycles?.some((currentCycle) => currentCycle.name === currency.name);
    return { value: currency.name, label: currency.name, disabled: isDisabled };
  });

export const getCurrency = (name: string) =>
  availableCurrencies.find((currency) => currency.name === name);
