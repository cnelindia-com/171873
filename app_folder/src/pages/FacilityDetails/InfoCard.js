import React from "react";
import {
  InfoCardWrapper,
  Title,
  Address,
  Price,
  Badge,
  CTAButton,
  FieldLabel,
  FieldValue,
} from "./DetailsStyles";
import { useTranslation } from "react-i18next";

export default function InfoCard({ facility }) {
  const { t } = useTranslation();

  // Availability color mapping
  const availabilityColor = {
    1: "#28a745", // green
    2: "#fd7e14", // orange
    3: "#6c757d", // gray
  };

  // Map care_level to readable label dynamically
  const careLevelMap = {
    1: t("details.care_basic"),
    2: t("details.care_dementia"),
    3: t("details.care_intensive"),
    4: t("details.care_short_term"),
  };

  // Map availability to label dynamically
  const availabilityMap = {
    "1": t("details.availability_immediate"),
    "2": t("details.availability_soon"),
    "3": t("details.availability_on_request"),
  };

  return (
    <InfoCardWrapper>
      {/* Facility Name */}
      <Title>{facility.name_of_the_place}</Title>

      {/* Address */}
      {facility.city && (
        <div>
          <FieldLabel>{t("details.address")}:</FieldLabel>
          <FieldValue>{facility.city}</FieldValue> | <FieldValue>{facility.postal_code}</FieldValue>
          <FieldValue>{facility.street}</FieldValue>
        </div>
      )}

      {/* Care Type */}
      {facility.care_level && (
        <div>
          <FieldLabel>{t("details.care_type")}:</FieldLabel>
          <FieldValue>{careLevelMap[facility.care_level] || "-"}</FieldValue>
        </div>
      )}

      {/* Price per month */}
      {facility.price_per_month && (
        <Price>
          {t("details.price")}: {facility.price_per_month} {t("details.per_month")}
        </Price>
      )}

      {/* Availability */}
      <Badge color={availabilityColor[facility.availability]}>
        {availabilityMap[facility.availability] || "-"}
      </Badge>

      {/* Rating */}
      <div style={{ margin: "0.5rem 0", fontWeight: "500" }}>
        {t("details.rating")}: {facility.rating || "4.5"} / 5
      </div>

      {/* Request Inquiry Button */}
      <CTAButton
        onClick={() =>
          document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        {t("details.request_inquiry")}
      </CTAButton>

      <small style={{ display: "block", marginTop: "0.5rem", color: "#6c757d" }}>
        {t("details.no_commitment")}
      </small>
    </InfoCardWrapper>
  );
}
