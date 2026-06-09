import { I18nProvider } from "@heroui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useTheme } from "./hooks/useTheme";
import { resolveLocale } from "./locales";
import { HomePage } from "./pages/HomePage";

function App() {
  const { i18n } = useTranslation();
  const { setThemeMode, themeMode } = useTheme();

  useEffect(() => {
    const locale = resolveLocale(i18n.resolvedLanguage ?? i18n.language);
    document.documentElement.lang = locale.bcp47;
  }, [i18n.language]);

  const locale = resolveLocale(i18n.resolvedLanguage ?? i18n.language);

  return (
    <I18nProvider locale={locale.bcp47}>
      <Routes>
        <Route element={<Layout onThemeModeChange={setThemeMode} themeMode={themeMode} />}>
          <Route element={<HomePage />} index />
        </Route>
      </Routes>
    </I18nProvider>
  );
}

export default App;
