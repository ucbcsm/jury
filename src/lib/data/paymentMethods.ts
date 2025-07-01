import { PaymentMethod } from "@/types";

const availablePaymentMethods: Omit<PaymentMethod, "id" | "enabled">[] = [
  {
    name: "Espèce",
    description:
      "Paiement direct en argent liquide au guichet de l'établissement.",
  },
  {
    name: "Mobile Money",
    description:
      "Paiement via des services mobiles comme M-Pesa, Airtel Money ou Orange Money.",
  },
  {
    name: "Virement bancaire",
    description:
      "Transfert direct depuis un compte bancaire vers le compte de l'établissement.",
  },
  {
    name: "Carte bancaire",
    description:
      "Paiement par carte de crédit ou de débit via un terminal ou en ligne.",
  },
  {
    name: "Chèque",
    description: "Paiement par chèque bancaire, sous réserve d'acceptation.",
  },
];

export const getPaymentMethodsAsOptions = availablePaymentMethods.map((method) => {
    return { value: method.name, label: method.name };
});

export const getPaymentMethodsAsOptionsWithDisabled = (currentMethods?: { name: string }[]) =>
    availablePaymentMethods.map((method) => {
        const isDisabled = currentMethods?.some((currentMethod) => currentMethod.name === method.name);
        return { value: method.name, label: method.name, disabled: isDisabled };
    });

export const getPaymentMethod = (name: string) =>
    availablePaymentMethods.find((method) => method.name === name);
