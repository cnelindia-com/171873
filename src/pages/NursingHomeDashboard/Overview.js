import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StatsContainer,
  StatCard,
  StatNumber,
  StatLabel,
} from "./StyledComponents";
import styled from "styled-components";
import "../../css/theme.css"; // Theme import
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../BaseUrl";
// ===== Styled Components =====
const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const WelcomeTitle = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text-main); /* 👈 Using theme variable */
`;

const NursingHomeHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-shadow);
  margin: 1rem 0;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 1rem;
`;

/* ===== Action Buttons using theme variables ===== */
const ActionButton = styled.button`
  background: var(--color-primary); /* 👈 Main button color */
  color: #fff;
  padding: 0.7rem 1.4rem;
  font-size: 1rem;
  border: none;
  border-radius: var(--btn-radius);
  cursor: pointer;
  transition: 0.2s ease;
  width: 100%;
  height: auto;
  font-weight: var(--font-weight-medium);

  &:hover {
    background: var(--color-primary-dark); /* 👈 Hover = dark primary */
  }

  /* SECOND BUTTON VARIANT */
  &:nth-child(2) {
    background: var(--color-success); /* 👈 success color */
    &:hover {
      background: #27ae60; /* optional darker shade */
    }
  }
`;

// ===== Component =====
const Overview = ({
  userName,
}) => {
  const [totalSpots, setTotalSpots] = useState(0);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [monthlyInquiries, setMonthlyInquiries] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
      axios
        .get(`${BaseUrl}dashboard/overview`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pflegeUserToken")}`,
          },
        })
        .then((res) => {
          setTotalSpots(res.data.total_spots);
          setTotalInquiries(res.data.total_inquiries);
          setMonthlyInquiries(res.data.monthly_inquiries);
        })
        .catch((err) => console.error(err));
  }, []);
  return (
    <SectionContainer>
      {/* === Welcome Header === */}
      <NursingHomeHeader>
        <WelcomeTitle>
          Willkommen zurück, {userName || "Ihr Pflegeheim"}
        </WelcomeTitle>
      </NursingHomeHeader>

      {/* === KPI Cards === */}
      <StatsContainer>
        <StatCard>
          <StatNumber>{totalSpots}</StatNumber>
          <StatLabel>Active places</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>{totalInquiries}</StatNumber>
          <StatLabel>Total inquiries</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>{monthlyInquiries}</StatNumber>
          <StatLabel>This month</StatLabel>
        </StatCard>
      </StatsContainer>

      <Divider />

      {/* === Quick Actions === */}
      <ActionsRow>
        <ActionButton onClick={() => navigate("/dashboard/places/new")}>
          Add new place
        </ActionButton>

        <ActionButton onClick={() => navigate("/dashboard/subscription")}>
          Manage subscription
        </ActionButton>
      </ActionsRow>

      <Divider />
    </SectionContainer>
  );
};

export default Overview;
