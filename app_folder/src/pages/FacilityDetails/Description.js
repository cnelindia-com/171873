import React from "react";
import { Section, SectionTitle } from "./DetailsStyles";
import { useTranslation } from "react-i18next"; // use i18next

export default function Description({ text }) {
  const { t, i18n } = useTranslation();
  const language = i18n.language; // "en" or "de"
  const description = text?.[language] || "";

  return (
    <Section>
      <SectionTitle>{t("details.description")}</SectionTitle>
      <p>{description || t("details.no_description")}</p>
    </Section>
  );
}
