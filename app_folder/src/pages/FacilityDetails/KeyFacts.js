import React from "react";
import {
  Section,
  SectionTitle,
  FactsGrid,
  FactCard,
  FactIcon,
  FactText,
} from "./DetailsStyles";
import { useTranslation } from "react-i18next"; // use i18next
export default function KeyFacts({ facility }) {
    const { t } = useTranslation();
  return (
    <Section>
      <SectionTitle>{t("details.key_facts")}</SectionTitle>

      <FactsGrid>
        {facility.care_level && (
          <FactCard>
            <FactIcon>🏥</FactIcon>
            <FactText>
             {t(`details.care_levels.${facility.care_level}`)}
            </FactText>

          </FactCard>
        )}

        {facility.room_type && (
          <FactCard>
            <FactIcon>🛏️</FactIcon>
            <FactText>
              {t(`details.room_types.${facility.room_type}`)}
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
              {t(`details.availability.${facility.availability}`)}
            </FactText>
          </FactCard>
        )}
      </FactsGrid>
    </Section>
  );
}
