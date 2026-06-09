import { Button, Dropdown, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { ChevronDown, Languages, Monitor, Moon, Sun } from "lucide-react";
import type { Key } from "react";
import { useTranslation } from "react-i18next";
import type { ThemeMode } from "../hooks/useTheme";
import { localeDefinitions } from "../locales";

type HeaderProps = {
  onThemeModeChange: (themeMode: ThemeMode) => void;
  themeMode: ThemeMode;
};

const themeItems = [
  { id: "light", labelKey: "theme.light", icon: Sun },
  { id: "dark", labelKey: "theme.dark", icon: Moon },
  { id: "system", labelKey: "theme.system", icon: Monitor },
] as const;

export function Header({ onThemeModeChange, themeMode }: HeaderProps) {
  const { i18n, t } = useTranslation();

  const changeLanguage = (key: Key | null) => {
    if (typeof key !== "string") {
      return;
    }

    const selectedLocale = localeDefinitions.find(item => item.code === key);

    if (selectedLocale) {
      void i18n.changeLanguage(selectedLocale.code);
    }
  };

  const changeTheme = (keys: "all" | Set<Key>) => {
    if (keys === "all") {
      return;
    }

    const [selectedKey] = Array.from(keys);

    if (selectedKey === "light" || selectedKey === "dark" || selectedKey === "system") {
      onThemeModeChange(selectedKey);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1382px] items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="text-lg font-semibold">{t("header.title")}</div>

        <div className="flex items-center gap-2">
          <Dropdown>
            <Dropdown.Trigger>
              <Button variant="ghost">
                <Languages aria-hidden="true" size={16} />
                {t("header.language")}
                <ChevronDown aria-hidden="true" size={16} />
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Menu aria-label={t("header.language")} onAction={changeLanguage}>
                {localeDefinitions.map(item => (
                  <Dropdown.Item id={item.code} key={item.code} textValue={item.nativeLabel}>
                    {item.nativeLabel}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          <ToggleButtonGroup
            aria-label="Theme switcher"
            disallowEmptySelection
            onSelectionChange={changeTheme}
            selectedKeys={new Set([themeMode])}
            selectionMode="single"
          >
            {themeItems.map(({ id, icon: Icon, labelKey }, index) => (
              <ToggleButton aria-label={t(labelKey)} id={id} isIconOnly key={id} variant="default">
                {index > 0 && <ToggleButtonGroup.Separator />}
                <Icon aria-hidden="true" size={16} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      </div>
    </header>
  );
}
