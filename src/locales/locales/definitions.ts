import en_US from "./en_US.json";
import ru_RU from "./ru_RU.json";

export type LocaleMessages = { [key: string]: string | LocaleMessages };

export type LocaleDefinition = {
  aliases: readonly string[];
  bcp47: string;
  code: string;
  label: string;
  messages: LocaleMessages;
  nativeLabel: string;
};

export const localeDefinitions = [
  {
    aliases: ["en", "en-us", "en_us"],
    bcp47: "en-US",
    code: "en_US",
    label: "English",
    messages: en_US,
    nativeLabel: "English",
  },
  {
    aliases: ["ru", "ru-ru", "ru_ru"],
    bcp47: "ru-RU",
    code: "ru_RU",
    label: "Russian",
    messages: ru_RU,
    nativeLabel: "Русский",
  },
] as const satisfies readonly LocaleDefinition[];
