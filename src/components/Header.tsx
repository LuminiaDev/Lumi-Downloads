import { Button, Dropdown, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { Check, ChevronDown, Languages, Monitor, Moon, Sun } from "lucide-react";
import type { Key } from "react";
import { useTranslation } from "react-i18next";
import type { ThemeMode } from "../hooks/useTheme";
import { localeDefinitions, resolveLocale } from "../locales";

type HeaderProps = {
  onThemeModeChange: (themeMode: ThemeMode) => void;
  themeMode: ThemeMode;
};

const themeItems = [
  { id: "light", labelKey: "theme.light", icon: Sun },
  { id: "dark", labelKey: "theme.dark", icon: Moon },
  { id: "system", labelKey: "theme.system", icon: Monitor },
] as const;

type LanguageMenuProps = {
  activeLocaleCode: string;
  label: string;
  onAction: (key: Key | null) => void;
};

function LanguageMenu({ activeLocaleCode, label, onAction }: LanguageMenuProps) {
  return (
    <Dropdown.Popover>
      <Dropdown.Menu aria-label={label} onAction={onAction}>
        {localeDefinitions.map(item => (
          <Dropdown.Item id={item.code} key={item.code} textValue={item.nativeLabel}>
            <span className="flex w-full items-center justify-between gap-4">
              <span>{item.nativeLabel}</span>
              {item.code === activeLocaleCode && <Check aria-hidden="true" size={16} />}
            </span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown.Popover>
  );
}

export function Header({ onThemeModeChange, themeMode }: HeaderProps) {
  const { i18n, t } = useTranslation();
  const activeLocaleCode = resolveLocale(i18n.resolvedLanguage ?? i18n.language).code;
  const activeTheme = themeItems.find(item => item.id === themeMode) ?? themeItems[2];
  const ActiveThemeIcon = activeTheme.icon;

  const changeLanguage = (key: Key | null) => {
    if (typeof key !== "string") {
      return;
    }

    const selectedLocale = localeDefinitions.find(item => item.code === key);

    if (selectedLocale) {
      void i18n.changeLanguage(selectedLocale.code);
    }
  };

  const selectTheme = (key: Key | null) => {
    if (key === "light" || key === "dark" || key === "system") {
      onThemeModeChange(key);
    }
  };

  const changeTheme = (keys: "all" | Set<Key>) => {
    if (keys !== "all") {
      selectTheme(Array.from(keys)[0] ?? null);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1382px] items-center justify-between gap-2 px-4 py-3 md:px-6">
        <div className="min-w-0 truncate text-lg font-semibold">{t("header.title")}</div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <Dropdown>
              <Dropdown.Trigger>
                <Button aria-label={t("header.language")} variant="ghost">
                  <Languages aria-hidden="true" size={16} />
                  {t("header.language")}
                  <ChevronDown aria-hidden="true" size={16} />
                </Button>
              </Dropdown.Trigger>
              <LanguageMenu
                activeLocaleCode={activeLocaleCode}
                label={t("header.language")}
                onAction={changeLanguage}
              />
            </Dropdown>
          </div>

          <div className="sm:hidden">
            <Dropdown>
              <Dropdown.Trigger>
                <Button
                  aria-label={t("header.language")}
                  className="min-w-14 gap-1 px-2"
                  variant="secondary"
                >
                  <Languages aria-hidden="true" size={16} />
                  <ChevronDown aria-hidden="true" size={14} />
                </Button>
              </Dropdown.Trigger>
              <LanguageMenu
                activeLocaleCode={activeLocaleCode}
                label={t("header.language")}
                onAction={changeLanguage}
              />
            </Dropdown>
          </div>

          <div className="hidden sm:block">
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

          <Dropdown>
            <Dropdown.Trigger>
              <Button
                aria-label={t(activeTheme.labelKey)}
                className="min-w-14 gap-1 px-2 sm:hidden"
                style={{ color: "var(--color-foreground)" }}
                variant="secondary"
              >
                <ActiveThemeIcon aria-hidden="true" size={16} />
                <ChevronDown aria-hidden="true" size={14} />
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Menu aria-label="Theme switcher" onAction={selectTheme}>
                {themeItems.map(({ id, icon: Icon, labelKey }) => (
                  <Dropdown.Item id={id} key={id} textValue={t(labelKey)}>
                    <span className="flex w-full items-center justify-between gap-4">
                      <span className="flex items-center gap-2">
                        <Icon aria-hidden="true" size={16} />
                        {t(labelKey)}
                      </span>
                      {id === themeMode && <Check aria-hidden="true" size={16} />}
                    </span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
