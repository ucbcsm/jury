import api from "@/lib/fetcher";
import { PaymentMethod } from "@/types";

export async function getPaymentMethods() {
  const res = await api.get(`/main_config/payment-method/`);
  return res.data as PaymentMethod[];
}

/**
 * Creates a new payment method by sending a POST request to the API.
 *
 * @param params - An object containing the details of the payment method to be created.
 *                 This object should exclude the `id` property.
 * @param params.name - The name of the payment method.
 * @param params.description - An optional description of the payment method. Defaults to an empty string if not provided.
 * @param params.enabled - A boolean indicating whether the payment method is enabled. Defaults to `false` if not provided.
 * 
 * @returns A promise that resolves to the response data from the API.
 * 
 * @throws Will throw an error if the API request fails.
 * 
 * @example
 * ```typescript
 * const newPaymentMethod = await createPaymentMethod({
 *   name: "Credit Card",
 *   description: "Payment method for credit card transactions",
 *   enabled: true,
 * });
 * console.log(newPaymentMethod);
 * ```
 */
export async function createPaymentMethod(params: Omit<PaymentMethod, "id">) {
  const res = await api.post(`/main_config/payment-method/`, {
    name: params.name,
    description: params.description || "",
    enabled: params.enabled||false,
  });
  return res.data;
}

export async function updatePaymentMethod({ id, params }: { id: number; params: any }) {
  const res = await api.put(`/main_config/payment-method/${id}/`, {
    ...params
  });
  return res.data;
}

export async function deletePaymentMethod(id: number) {
  const res = await api.delete(`/main_config/payment-method/${id}/`);
  return res.data;
}
