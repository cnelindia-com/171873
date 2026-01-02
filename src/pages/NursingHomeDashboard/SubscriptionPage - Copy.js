import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MainContent } from "./StyledComponents";
import { loadStripe } from "@stripe/stripe-js";
import { BaseUrl } from "../../BaseUrl"; // ✅ your BaseUrl

/* ================= STRIPE ================= */
const stripePromise = loadStripe("pk_test_xxxxx"); // 🔴 your publishable key

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
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState(null);
  const [currentstatus, setcurrentstatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);

  const token = localStorage.getItem("pflegeUserToken");

  useEffect(() => {
    
    /* ===== Fetch Plans ===== */
    fetch(`${BaseUrl}stripe/plans`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setPlans)
      .catch((err) => console.error("Plans API error:", err));

    /* ===== Fetch Current Subscription ===== */
    fetch(`${BaseUrl}stripe/current-subscription`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        // console.log("Subscription Data:", data.current_period_end);
        setCurrentPlan(data?.planName || null);
        setCurrentPeriodEnd(data?.current_period_end || null);
        setcurrentstatus(data?.status || null);
      })
      .catch((err) => console.error("Current plan error:", err));

      
  }, [token]);

//  useEffect(() => {
//   const sessionId = "cs_test_a1xZxcNaFg9T7K1Ev80e2RxIDc2LVtdZcNJgxijzS9m2aNwhg27btmX3N7"
//   alert(sessionId);
//   if (!sessionId) return;

//   fetch(`${BaseUrl}stripe/subscription-success`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ session_id: sessionId }),
//   })
//     .then(res => res.json())
//     .then(() => {
//       window.history.replaceState({}, "", "/dashboard/subscription");
//     });
// }, []);



  /* ===== SUBSCRIBE ===== */
 const handleSubscribe = async (stripePriceId) => {
  try {
    setLoading(true);

    const res = await fetch(`${BaseUrl}create-subscription-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ price_id: stripePriceId }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();

    // Redirect directly to the session URL
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("No Stripe session URL returned.");
    }

  } catch (error) {
    console.error("Stripe subscribe error:", error);
    alert("Unable to start subscription. Please try again.");
  } finally {
    setLoading(false);
  }
};


  /* ===== MANAGE SUBSCRIPTION ===== */
  const handleManageSubscription = async () => {
  try {
    const res = await fetch(`${BaseUrl}stripe/customer-portal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}) // Add empty body if needed
    });

    const text = await res.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || "Invalid response from server");
    }

    if (!res.ok) {
      throw new Error(data.message || data.error || "Request failed");
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("No portal URL received");
    }
  } catch (error) {
    console.error("Customer portal error:", error);
    alert(`Unable to open customer portal: ${error.message}`);
  }
};

  return (
    <MainContent>
      <Page>
        {/* CURRENT PLAN */}
        <SectionTitle>Current Subscription</SectionTitle>
        <Card>
          <CurrentGrid>
            <Info>
              <Label>Plan</Label>
              <Value>{currentPlan || "None"}</Value>
            </Info>

            <Info>
              <Label>Status</Label>
              <Status active={currentstatus === "active"}>{currentstatus}</Status>
            </Info>

            <Info>
              <Label>Next Billing</Label>
              <Value>
                {currentPeriodEnd 
                  ? new Date(currentPeriodEnd).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : "None"}
              </Value>            
              </Info>
            <Button onClick={handleManageSubscription}>
              Manage Subscription
            </Button>
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
              <PlanCard key={plan.id}>
                <PlanName>{plan.name}</PlanName>
                <Price>
                  {plan.price} {plan.currency}/{plan.interval}
                </Price>

                <Features>
                  {plan.features?.map((f, i) => (
                    <Feature key={i}>{f}</Feature>
                  ))}
                </Features>

                <Button
                  disabled={isActive || loading}
                  active={isActive}
                  onClick={() =>
                    !isActive && handleSubscribe(plan.id)
                  }
                >
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