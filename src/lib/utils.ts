// generate hslColor
const getHashOfString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min);
};

const generateHSL = (name: string) => {
  const hRange = [0, 360];
  const sRange = [50, 75];
  const lRange = [25, 60];
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, hRange[0], hRange[1]);
  const s = normalizeHash(hash, sRange[0], sRange[1]);
  const l = normalizeHash(hash, lRange[0], lRange[1]);
  return [h, s, l];
};

export const getHSLColor = (name: string) => {
  const hsl = generateHSL(name);

  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};

export const getMaritalStatusName = (
  value: "single" | "married" | "divorced" | "widowed" | string
) => {
  switch (value) {
    case "single":
      return "Célibataire";
    case "married":
      return "Marié(e)";
    case "divorced":
      return "Divorcé(e)";
    case "widowed":
      return "Veuf(ve)";
    default:
      return "Inconnu";
  }
};

export const filterOption = (
  input: string,
  option:
    | {
        value: number;
        label: string;
      }
    | undefined
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());


export function percentageFormatter(value: number) {
  return new Intl.NumberFormat("fr", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function toFixedNumber(value: number | string, fixed: number = 0) {
  return Number(Number(value).toFixed(fixed));
}