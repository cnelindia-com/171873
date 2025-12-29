import React, { useState } from "react";
import styled from "styled-components";
import { MainContent } from "./StyledComponents";

/* ================= STYLES ================= */

const Page = styled.div`
  padding: 2.5rem 3rem;
  background: #f8f9fb;
  min-height: 100vh;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 1.8rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
`;

const CurrentGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: 0.85rem;
  color: #888;
`;

const Value = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
  color: #2c3e50;
`;

const Status = styled.span`
  background: ${({ active }) => (active ? "#2ecc71" : "#f1c40f")};
  color: white;
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  width: fit-content;
`;

const Plans = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
`;

const PlanCard = styled(Card)`
  text-align: center;
  border: 2px solid transparent;
  transition: 0.3s;

  &:hover {
    border-color: #667eea;
    transform: translateY(-4px);
  }
`;

const PlanName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
`;

const Price = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0.5rem 0;
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  text-align: left;
`;

const Feature = styled.li`
  margin-bottom: 0.5rem;
  color: #555;

  &:before {
    content: "✓ ";
    color: #667eea;
    font-weight: bold;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  color: white;
  background: ${({ active }) => (active ? "#2ecc71" : "#667eea")};

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

/* ================= COMPONENT ================= */

const SubscriptionPage = () => {
  const [currentPlan] = useState("PRO");

  const plans = [
    {
      name: "BASIC",
      price: "€49 / month",
      features: ["Up to 3 places", "Photo upload", "Standard ranking"],
    },
    {
      name: "PRO",
      price: "€99 / month",
      features: ["Unlimited places", "Full gallery", "Priority ranking"],
    },
    {
      name: "ENTERPRISE",
      price: "€299 / month",
      features: [
        "Unlimited places",
        "Featured badge",
        "Top ranking",
        "Analytics access",
      ],
    },
  ];

  return (
    <MainContent>
      <Page>
        {/* CURRENT PLAN */}
        <SectionTitle>Current Subscription</SectionTitle>
        <Card>
          <CurrentGrid>
            <Info>
              <Label>Plan</Label>
              <Value>{currentPlan}</Value>
            </Info>

            <Info>
              <Label>Status</Label>
              <Status active>Active</Status>
            </Info>

            <Info>
              <Label>Next Billing</Label>
              <Value>15 Jan 2026</Value>
            </Info>

            <Button>Manage Subscription</Button>
          </CurrentGrid>
        </Card>

        {/* PLANS */}
        <SectionTitle style={{ marginTop: "3rem" }}>
          Choose Your Plan
        </SectionTitle>

        <Plans>
          {plans.map((plan) => {
            const isActive = plan.name === currentPlan;

            return (
              <PlanCard key={plan.name}>
                <PlanName>{plan.name}</PlanName>
                <Price>{plan.price}</Price>

                <Features>
                  {plan.features.map((f) => (
                    <Feature key={f}>{f}</Feature>
                  ))}
                </Features>

                <Button disabled={isActive} active={isActive}>
                  {isActive ? "Current Plan" : "Choose Plan"}
                </Button>
              </PlanCard>
            );
          })}
        </Plans>
      </Page>
    </MainContent>
  );
};

export default SubscriptionPage;
