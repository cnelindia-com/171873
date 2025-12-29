import React from "react";
import { Section, SectionTitle } from "./DetailsStyles";

export default function Description({ text }) {
  return (
    <Section>
      <SectionTitle>Beschreibung</SectionTitle>
      <p>{text || "Noch keine Beschreibung verfügbar."}</p>
    </Section>
  );
}
