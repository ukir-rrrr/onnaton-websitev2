export type IntlReservationFormValues = {
  name: string;
  email: string;
  country: string;
  datePreference1: string;
  datePreference2: string;
  datePreference3: string;
  adults: string;
  children: string;
  notes: string;
  agreePolicy: boolean;
};

export type IntlReservationState = {
  ok: boolean;
  error?: string;
  reference?: string;
  values?: IntlReservationFormValues;
};

export const defaultIntlReservationFormValues: IntlReservationFormValues = {
  name: "",
  email: "",
  country: "",
  datePreference1: "",
  datePreference2: "",
  datePreference3: "",
  adults: "2",
  children: "0",
  notes: "",
  agreePolicy: false,
};

export function valuesFromIntlFormData(formData: FormData): IntlReservationFormValues {
  const str = (key: string) => String(formData.get(key) ?? "").trim();
  const adults = str("adults");
  const children = str("children");
  return {
    name: str("name"),
    email: str("email"),
    country: str("country"),
    datePreference1: str("date_preference_1"),
    datePreference2: str("date_preference_2"),
    datePreference3: str("date_preference_3"),
    adults: adults || "2",
    children: children || "0",
    notes: str("notes"),
    agreePolicy: formData.get("agreePolicy") === "on",
  };
}
