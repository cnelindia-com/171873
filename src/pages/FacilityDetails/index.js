import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

import {
  PageWrapper,
  TopGrid,
  Section,
} from "./DetailsStyles";

import Gallery from "./Gallery";
import InfoCard from "./InfoCard";
import Description from "./Description";
import KeyFacts from "./KeyFacts";
import Location from "./Location";
import InquiryForm from "./InquiryForm";

export default function FacilityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await axios.get(`${BaseUrl}facility/${id}`);
        setFacility(response.data.data);
      } catch (error) {
        console.error("Failed to fetch facility:", error);
      }
    };

    fetchFacility();
  }, [id]);

  if (!facility) return <p>Lade Details der Anlage....</p>;

  return (
    <PageWrapper>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // goes back to previous page
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#1565C0",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        ← Zurück zur Suche
      </button>

      {/* Top section: Gallery left + Info Card right */}
      <TopGrid>
        <div style={{ gridArea: "gallery" }}>
          <Gallery facilityId={facility.id} />
        </div>
        <div style={{ gridArea: "infoCard" }}>
          <InfoCard facility={facility} />
        </div>
      </TopGrid>

      {/* Key Facts */}
      <KeyFacts facility={facility} />

      {/* Description */}
      <Description text={facility.description} />

      {/* Location */}
      <Location address={facility.city} />

      {/* Inquiry Form */}
      <Section id="inquiry">
        <InquiryForm 
          facilityId={facility.id} 
          careOptions={Array.isArray(facility.care_level) ? facility.care_level : [facility.care_level]} 
        />
      </Section>
    </PageWrapper>
  );
}
