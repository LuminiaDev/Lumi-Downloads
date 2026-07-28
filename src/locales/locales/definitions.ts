import de_DE from "./de_DE.json";
import en_US from "./en_US.json";
import fr_FR from "./fr_FR.json";
import pl_PL from "./pl_PL.json";
import ru_RU from "./ru_RU.json";
import uk_UA from "./uk_UA.json";

export type LocaleMessages = { [key: string]: string | LocaleMessages };

export type LocaleDefinition = {
  aliases: readonly string[];
  bcp47: string;
  code: string;
  flagCountryCode: string;
  label: string;
  messages: LocaleMessages;
  nativeLabel: string;
};

export const localeDefinitions = [
  {
    aliases: ["en", "en-us", "en_us"],
    bcp47: "en-US",
    code: "en_US",
    flagCountryCode: "us",
    label: "English",
    messages: en_US,
    nativeLabel: "English",
  },
  {
    aliases: ["ru", "ru-ru", "ru_ru"],
    bcp47: "ru-RU",
    code: "ru_RU",
    flagCountryCode: "ru",
    label: "Russian",
    messages: ru_RU,
    nativeLabel: "Русский",
  },
  {
    aliases: ["uk", "uk-ua", "uk_ua", "ua"],
    bcp47: "uk-UA",
    code: "uk_UA",
    flagCountryCode: "ua",
    label: "Ukrainian",
    messages: uk_UA,
    nativeLabel: "Українська",
  },
  {
    aliases: ["pl", "pl-pl", "pl_pl"],
    bcp47: "pl-PL",
    code: "pl_PL",
    flagCountryCode: "pl",
    label: "Polish",
    messages: pl_PL,
    nativeLabel: "Polski",
  },
  {
    aliases: ["de", "de-de", "de_de"],
    bcp47: "de-DE",
    code: "de_DE",
    flagCountryCode: "de",
    label: "German",
    messages: de_DE,
    nativeLabel: "Deutsch",
  },
  {
    aliases: ["fr", "fr-fr", "fr_fr"],
    bcp47: "fr-FR",
    code: "fr_FR",
    flagCountryCode: "fr",
    label: "French",
    messages: fr_FR,
    nativeLabel: "Français",
  },
] as const satisfies readonly LocaleDefinition[];
