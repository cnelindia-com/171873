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

export default function InfoCard({ facility }) {
  const availabilityColor = {
    1: "#28a745", // green
    2: "#fd7e14", // orange
    3: "#6c757d", // gray
  };

  return (
    <InfoCardWrapper>
      {/* Facility Name */}
      <Title>{facility.name_of_the_place}</Title>

      {/* Address (only if available) */}
      {facility.city && (
        <div>
          <FieldLabel>Adresse:</FieldLabel>
           <FieldValue>{facility.city}</FieldValue> | <FieldValue>{facility.postal_code}</FieldValue>
          <FieldValue>{facility.street}</FieldValue>
        </div>
      )}
      {/* Care Type(s) */}
      {facility.care_level && (
        <div>
          <FieldLabel>Pflege Art(s):</FieldLabel>
          <FieldValue>{facility.care_level == 1 ? "Stufe 1" : facility.care_level == 2 ? "Stufe 2" : "Stufe 3"}</FieldValue>
        </div>
      )}

      {/* Price per month */}
      {facility.price_per_month && (
        <Price>Preis : {facility.price_per_month} €/Monat</Price>
      )}

      {/* Availability */}
      <Badge color={availabilityColor[facility.availability]}>
        {facility.availability === "1"
          ? "Sofort"
          : facility.availability === "2"
          ? "Kurzfristig"
          : "1–3 Monate"}
      </Badge>

      {/* Rating placeholder */}
      <div style={{ margin: "0.5rem 0", fontWeight: "500" }}>
        Bewertung: {facility.rating || "4.5"} / 5
      </div>

      {/* Request Inquiry Button */}
      <CTAButton
        onClick={() =>
          document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Anfrage stellen
      </CTAButton>

      <small style={{ display: "block", marginTop: "0.5rem", color: "#6c757d" }}>
        Keine Vertragsverpflichtung – Ihre Anfrage ist unverbindlich.
      </small>
    </InfoCardWrapper>
  );
}
