import React from "react";
import {
  Section,
  SectionTitle,
  FactsGrid,
  FactCard,
  FactIcon,
  FactText,
} from "./DetailsStyles";

export default function KeyFacts({ facility }) {
  const roomTypeMap = {
    "1": "Einzelzimmer",
    "2": "Doppelzimmer",
  };

  const availabilityMap = {
    "1": "Sofort",
    "2": "Kurzfristig",
    "3": "1–3 Monate",
  };

  return (
    <Section>
      <SectionTitle>Wichtige Fakten</SectionTitle>

      <FactsGrid>
        {facility.care_level && (
          <FactCard>
            <FactIcon>🏥</FactIcon>
            <FactText>
              {facility.care_level == 1
                ? "Stufe 1"
                : facility.care_level == 2
                  ? "Stufe 2"
                  : "Stufe 3"}
            </FactText>

          </FactCard>
        )}

        {facility.room_type && (
          <FactCard>
            <FactIcon>🛏️</FactIcon>
            <FactText>
              {roomTypeMap[facility.room_type] || "Auf Anfrage"}
            </FactText>
          </FactCard>
        )}

        {facility.minimum_stay && (
          <FactCard>
            <FactIcon>📅</FactIcon>
            <FactText>{facility.minimum_stay}</FactText>
          </FactCard>
        )}

        {facility.special_services && (
          <FactCard>
            <FactIcon>⭐</FactIcon>
            <FactText>{facility.special_services}</FactText>
          </FactCard>
        )}

        {facility.availability && (
          <FactCard>
            <FactIcon>⏱️</FactIcon>  
            <FactText>
              {availabilityMap[facility.availability] || "Auf Anfrage"}
            </FactText>
          </FactCard>
        )}
      </FactsGrid>
    </Section>
  );
}
