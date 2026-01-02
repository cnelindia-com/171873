import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BaseUrl } from "../../BaseUrl";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const SubTitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const SubscriptionSuccess = () => {
  const [plan, setPlan] = useState(null);
  const token = localStorage.getItem("pflegeUserToken");

  useEffect(() => {
    // fetch current subscription
    fetch(`${BaseUrl}stripe/current-subscription`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => setPlan(data))
      .catch((err) => console.error("Current subscription fetch error:", err));
  }, [token]);

  return (
    <Page>
      <Title>Subscription Successful ✅</Title>
      {plan ? (
        <>
          <SubTitle>You have successfully subscribed to:</SubTitle>
          <h2>{plan.planName}</h2>
          <p>Status: {plan.status}</p>
          <p>Next Billing: {plan.nextBilling}</p>
        </>
      ) : (
        <SubTitle>Fetching your subscription details...</SubTitle>
      )}
      <Button onClick={() => (window.location.href = "/subscription")}>
        Go to My Plans
      </Button>
    </Page>
  );
};

export default SubscriptionSuccess;
