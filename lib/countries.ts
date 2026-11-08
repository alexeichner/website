// The 195 countries (193 UN members plus Vatican City and Palestine), plus Kosovo and Taiwan.
// Names must match the keys in app/countries/world-map.json.
export const COUNTRY_NAMES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Republic of the Congo", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal", "Serbia",
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
  "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
] as const;

export type CountryName = (typeof COUNTRY_NAMES)[number];

export const TOTAL_COUNTRIES = COUNTRY_NAMES.length;

// Other accepted answers, on top of each country's own name.
const ALIASES: Partial<Record<CountryName, string[]>> = {
  "United States": ["usa", "united states of america", "america"],
  "United Kingdom": ["uk"],
  "United Arab Emirates": ["uae"],
  "Democratic Republic of the Congo": ["drc", "dr congo"],
  "Republic of the Congo": ["congo"],
  "Central African Republic": ["car"],
  "North Korea": ["dprk"],
  Micronesia: ["federated states of micronesia"],
  "Vatican City": ["vatican", "holy see"],
  Russia: ["russian federation"],
  Palestine: ["state of palestine"],
  "Côte d'Ivoire": ["ivory coast"],
  Czechia: ["czech republic"],
  Türkiye: ["turkey"],
  "North Macedonia": ["macedonia"],
  "Timor-Leste": ["east timor"],
  "Cabo Verde": ["cape verde"],
};

// Ignores case, accents, spaces and punctuation; treats "&" as "and", "st" as "saint",
// and a leading "the" as optional. "St. Lucia" and "saint lucia" both become "saintlucia".
export function normalize(text: string) {
  const words = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((word) => (word === "st" ? "saint" : word));
  if (words[0] === "the") words.shift();
  return words.join("");
}

// Every accepted answer, normalized, mapped to its country.
export const ANSWERS = new Map<string, CountryName>(
  COUNTRY_NAMES.flatMap((name) =>
    [name, ...(ALIASES[name] ?? [])].map((answer) => [normalize(answer), name] as const),
  ),
);
