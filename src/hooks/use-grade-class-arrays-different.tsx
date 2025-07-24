import { GradeClass } from "@/types";
import { useMemo } from "react";

function areGradeClassArraysDifferent(
  arr1?: GradeClass[],
  arr2?: GradeClass[]
): boolean {
  if (!arr1 && !arr2) return false;
  if (!arr1 || !arr2) return true;
  if (arr1.length !== arr2.length) return true;

  const arr2Map = new Map(arr2.map((item) => [item.id, item]));

  for (const item1 of arr1) {
    const item2 = arr2Map.get(item1.id);
    if (!item2) return true;
    if (
      item1.continuous_assessment !== item2.continuous_assessment ||
      item1.exam !== item2.exam ||
      item1.is_retaken !== item2.is_retaken ||
      item1.session !== item2.session ||
      item1.moment !== item2.moment ||
      item1.status !== item2.status
    ) {
      return true;
    }
  }
  return false;
}


export function useGradeClassArraysDifferent(
  arr1?: GradeClass[],
  arr2?: GradeClass[]
): boolean {
  return useMemo(() => areGradeClassArraysDifferent(arr1, arr2), [arr1, arr2]);
}