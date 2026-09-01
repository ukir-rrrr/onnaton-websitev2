export interface CountryDialCode {
  id: string; // 一意キー。フォームの value。
  name: string; // 表示名（英語）
  dial: string; // "+1" 形式
}

export const countryDialCodes: CountryDialCode[] = [
  { id: "US", name: "United States", dial: "+1" },
  { id: "HK", name: "Hong Kong", dial: "+852" },
  { id: "TW", name: "Taiwan", dial: "+886" },
  { id: "KR", name: "South Korea", dial: "+82" },
  { id: "CN", name: "China", dial: "+86" },
  { id: "TH", name: "Thailand", dial: "+66" },
  { id: "SG", name: "Singapore", dial: "+65" },
  { id: "AU", name: "Australia", dial: "+61" },
  { id: "MY", name: "Malaysia", dial: "+60" },
  { id: "ID", name: "Indonesia", dial: "+62" },
  { id: "PH", name: "Philippines", dial: "+63" },
  { id: "VN", name: "Vietnam", dial: "+84" },
  { id: "IN", name: "India", dial: "+91" },
  { id: "CA", name: "Canada", dial: "+1" },
  { id: "GB", name: "United Kingdom", dial: "+44" },
  { id: "FR", name: "France", dial: "+33" },
  { id: "DE", name: "Germany", dial: "+49" },
  { id: "IT", name: "Italy", dial: "+39" },
  { id: "ES", name: "Spain", dial: "+34" },
];

export function findCountryDialCode(id: string): CountryDialCode | undefined {
  return countryDialCodes.find((entry) => entry.id === id);
}
