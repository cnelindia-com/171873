import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MainContent } from "./StyledComponents";
import { loadStripe } from "@stripe/stripe-js";
import { BaseUrl } from "../../BaseUrl"; // ✅ your BaseUrl
import { useTranslation } from 'react-i18next';
import { FaStripe } from "react-icons/fa";

const featureKeyMap = {
  "Unlimited places": "unlimited_places",
  "Featured badge": "featured_badge",
  "Top ranking": "top_ranking",
  "Analytics access": "analytics_access",
  "Full gallery": "full_gallery",
  "Priority ranking": "priority_ranking",
  "Up to 3 places": "up_to_3_places",
  "Photo upload": "photo_upload",
  "Standard ranking": "standard_ranking"
};

const PlanDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0.8rem 0 1.2rem;
  line-height: 1.4;
  text-align: left;
`;



/* ================= STRIPE ================= */
// const stripePromise = loadStripe("pk_test_xxxxx"); // 🔴 your publishable key
/* ================= STYLES ================= */
const Page = styled.div`
  padding: 2.5rem 3rem;
  background: #f8f9fb;
  min-height: 100vh;
`;

const StripeNote = styled.div`
  margin-top: 0.6rem;
  font-size: 0.8rem;
  color: #888;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  min-height: 18px; /* 🔥 IMPORTANT */
`;



const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem; /* Reduced margin */
  margin-top: 0.5rem; /* Reduced margin from the top */
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
  border-radius: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;

  border: ${({ enterprise, pro }) =>
    enterprise
      ? "3px solid transparent"
      : pro
      ? "2px solid rgba(0,0,0,0.10)"
      : "1px solid rgba(0,0,0,0.04)"};

  background: ${({ enterprise, pro }) =>
    enterprise
      ? "linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #1f2937, #4b5563) border-box"
      : pro
      ? "linear-gradient(180deg, #ffffff, #f9fafb)"
      : "#fff"};

  box-shadow: ${({ enterprise, pro }) =>
    enterprise
      ? "0 30px 70px rgba(0,0,0,0.25)"
      : pro
      ? "0 18px 40px rgba(0,0,0,0.16)"
      : "0 6px 16px rgba(0,0,0,0.06)"};

  transform: ${({ enterprise, pro }) =>
    enterprise ? "scale(1.06)" : pro ? "scale(1.02)" : "scale(1)"};

  &:hover {
    transform: ${({ enterprise, pro }) =>
      enterprise
        ? "scale(1.08)"
        : pro
        ? "scale(1.045)"
        : "scale(1.01)"};

    box-shadow: ${({ enterprise, pro }) =>
      enterprise
        ? "0 40px 90px rgba(0,0,0,0.32)"
        : pro
        ? "0 26px 55px rgba(0,0,0,0.22)"
        : "0 10px 22px rgba(0,0,0,0.1)"};
  }
`;




const EnterpriseBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-dark-background);
  color: #fff;
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 999px;
  letter-spacing: 0.5px;
`;



const PlanName = styled.h3`
  font-size: ${({ enterprise, pro }) =>
    enterprise ? "1.55rem" : pro ? "1.45rem" : "1.4rem"};
  font-weight: 700;
`;


const Price = styled.div`
  font-size: ${({ enterprise }) => (enterprise ? "2.5rem" : "2.1rem")};
  font-weight: 900;
  color: ${({ enterprise }) =>
    enterprise ? "#111827" : "#1a2b4f"};
  margin-top: 0.4rem;
`;






const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  text-align: left;
`;

const Feature = styled.li`
list-style: none;
  margin-bottom: 0.5rem;
  color: #555;

  // &:before {
  //   content: "✓ ";
  //   color: var(--color-dark-background);
  //   font-weight: bold;
  // }
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ enterprise }) => (enterprise ? "1.1rem" : "0.95rem")};
  border-radius: 14px;
  border: none;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  color: #fff;

background: ${({ enterprise, pro }) =>
  enterprise
    ? "linear-gradient(135deg, #111827, #28637e)"
    : pro
    ? "linear-gradient(135deg, #1f2937, #28637e)"
    : "var(--color-sidebar-background)"};


  box-shadow: ${({ enterprise }) =>
    enterprise ? "0 12px 26px rgba(0,0,0,0.35)" : "none"};

  &:hover {
    opacity: 0.95;
  }
`;





const ButtonWrapper = styled.div`
  margin-top: auto; /* 🔥 IMPORTANT */
  padding-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlanContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;


const CurrentSubscriptionCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const CurrentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  border-radius: 14px;
`;

const LeftPlan = styled.div`
  padding: 2rem;
  background: #f5f7fb;
  border-right: 1px solid #e6e8ee;
`;

const PlanTitle = styled.h2`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a2b4f;
`;

const PlanSub = styled.div`
  font-size: 0.9rem;
  color: #8a8fa3;
  margin-top: 0.3rem;
`;

const RightDetails = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;
const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.95rem;
`;

const RowLabel = styled.span`
  color: #8a8fa3;
  min-width: 140px;
`;

const RowValue = styled.span`
  font-weight: 600;
  color: #1a2b4f;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #2ecc71;
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  background: #e6e8ee;
`;

const ManageWrapper = styled.div`
  padding: 1.6rem;
  display: flex;
  justify-content: center;
`;

const BelowButtonNote = styled.div`
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: #8a8fa3;
  text-align: center;
`;

const PlansFooterNote = styled.div`
  margin-top: 7rem;
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
`;

/* ================= COMPONENT ================= */
const SubscriptionPage = () => {
  const { t } = useTranslation();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState(null);
  const [currentstatus, setcurrentstatus] = useState(null);
  // console.log("currentstatus:", currentstatus);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const isPaidUser = currentstatus === "active";
  // console.log("isPaidUser:", isPaidUser);
  // console.log("current_plan:", currentPlan);

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
        // window.open(data.url, "_blank");
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
        // window.location.href = data.url;
        window.open(data.url, "_blank");
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
        <SectionTitle>{t("subscription.current_subscription")}</SectionTitle>

        <CurrentSubscriptionCard>
          <CurrentWrapper>
            {/* LEFT */}
            <LeftPlan>
              <PlanTitle>
                {currentPlan
                  ? t(`subscription.current_plan_options.${currentPlan}`, {
                    defaultValue: currentPlan
                  })
                  : t("common.none")}
              </PlanTitle>
              <PlanSub>{t("subscription.plan")}</PlanSub>
            </LeftPlan>

            {/* RIGHT */}
            <RightDetails>
              <Row>
                <RowLabel>{t("subscription.status_label")}:</RowLabel>
                <StatusBadge>
                  ✓ {t(`subscription.status.${currentstatus}`, { defaultValue: currentstatus })}
                </StatusBadge>
              </Row>

              <Row>
                <RowLabel>{t("subscription.plan")}:</RowLabel>
                <RowValue>
                  {currentPlan
                    ? t(`subscription.current_plan_options.${currentPlan}`, {
                      defaultValue: currentPlan
                    })
                    : t("common.none")}
                </RowValue>
              </Row>

              <Row>
                <RowLabel>{t("subscription.next_billing")}:</RowLabel>
                <RowValue>
                  {currentPeriodEnd
                    ? new Date(currentPeriodEnd).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                    : t("common.none")}
                </RowValue>
              </Row>
            </RightDetails>
          </CurrentWrapper>

          <Divider />

          <ManageWrapper>
            {/* <Button
              active={currentstatus === "active"}
              disabled={!isPaidUser}
              style={{ maxWidth: "320px" }}
              onClick={() => {
                if (!isPaidUser) {
                  alert(t("subscription.upgrade_alert"));
                  return;
                }
                handleManageSubscription();
              }}
            >
              {t("subscription.manage")}
            </Button> */}
            {isPaidUser && (
            <Button
              active={currentstatus === "active"}
              style={{ maxWidth: "320px" }}
              onClick={handleManageSubscription}
            >
              {t("subscription.manage")}
            </Button>
          )}

          </ManageWrapper>
        </CurrentSubscriptionCard>
              {!isPaidUser && (
  <>
        {/* PLANS */}
        <SectionTitle style={{ marginTop: "3rem" , marginBottom:"2rem" }}>
          {t("subscription.choose_plan")}
        </SectionTitle>

        <Plans>
          {plans.map((plan) => {
  const isActive = plan.name === currentPlan;
const isEnterprise = plan.name.toLowerCase() === "enterprise";
const isPro = plan.name.toLowerCase() === "pro";

  return (
        <PlanCard
        key={plan.id}
        enterprise={isEnterprise}
        pro={isPro}
      >
      {/* {isEnterprise && (
        <EnterpriseBadge>
          🚀 MOST POWERFUL PLAN
        </EnterpriseBadge>
      )} */}

      <PlanContent>
       <PlanName enterprise={isEnterprise} pro={isPro} >
        {t(`subscription.plan_options.${plan.name}`, {
          defaultValue: plan.name
        })}
      </PlanName>

       <Price enterprise={isEnterprise}>
        € {plan.price}
        <span className="per">
          / {t(`subscription.interval.${plan.interval}`)}
        </span>
      </Price>

        <PlanDescription>
          {t(`subscription.planDescriptions.${plan.name}`)}
        </PlanDescription>

        {plan.features?.map((feature, i) => (
          <Feature key={i}>
            {t(`subscription.features.${featureKeyMap[feature]}`, {
              defaultValue: feature
            })}
          </Feature>
        ))}
      </PlanContent>

      <ButtonWrapper>
        <Button
          enterprise={isEnterprise}
          pro={isPro}
          active={isActive}
          disabled={loading}
          onClick={() =>
            isPaidUser
              ? handleManageSubscription()
              : handleSubscribe(plan.id)
          }
        >
          {isActive
            ? t("subscription.current_plan")
            : t("subscription.choose_plan")}
        </Button>
      </ButtonWrapper>
    </PlanCard>
  );
})}

        </Plans>
        <PlansFooterNote>
          {t("subscription.plansfooterNote")}
        </PlansFooterNote>
              </>
              
)}
      </Page>
    </MainContent>
  );
};
export default SubscriptionPage;