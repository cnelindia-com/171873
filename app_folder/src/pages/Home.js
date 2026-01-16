import React, { useState,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "../css/theme.css"; // 
import { useTranslation } from "react-i18next";
import { BaseUrl } from "../BaseUrl";

// ===================== STYLED COMPONENTS =====================
const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-background);
  font-family: var(--font-base);
  color: var(--color-text-main);
`;

const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    // var(--color-primary) 0%,
    var(--color-sidebar-background) 100%
  );
  color: #fff;
  padding: 4rem 2rem;
  border-radius: 15px;
  text-align: center;
  margin-bottom: 3rem;
  box-shadow: 0 10px 25px var(--color-shadow);
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: #fff;
  color: var(--color-primary);
  padding: 1rem 2.5rem;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--color-shadow);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px var(--color-shadow);
    background: var(--color-accent);
    color: #fff;
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: var(--color-text-main);
  font-size: 2.5rem;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background-color: var(--color-surface);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px var(--color-shadow);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
`;

const FeatureTitle = styled.h3`
  color: var(--color-text-main);
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background-color: #3B4E7333;
  padding: 3rem;
  border-radius: 15px;
  text-align: center;
  margin-bottom: 3rem;
  box-shadow: 0 5px 15px var(--color-shadow);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const StatItem = styled.div`
  background: linear-gradient(135deg, #ffffff, #f4f6fb);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  }
`;



const StatIcon = styled.div`
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
`;


const StatNumber = styled.div`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-accent)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;


const StatLabel = styled.div`
  color: #777;
  font-size: 1.1rem;
`;

const Footer = styled.footer`
  background-color: #2C3E50;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 3px 15px var(--color-shadow);
`;

const FooterText = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
`;

const PrivacyLink = styled.span`
  color: var(--color-accent);
  font-weight: 600;
  margin-left: 0.3rem;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

/* ================= PRIVACY POLICY FULLSCREEN ================= */
const PrivacyPage = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-surface);
  z-index: 99;
  overflow-y: auto;
  padding: 3rem;
  animation: fadeIn 0.4s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: 100px;
  right: 40px;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

const PolicyTitle = styled.h1`
  text-align: center;
  color: var(--color-text-main);
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SubTitle = styled.h2`
  font-size: 1.3rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-main);
`;

// ===================== COMPONENT =====================
function Home() {
  const { t } = useTranslation();

  const [showPolicy, setShowPolicy] = useState(false);
  // New state for stats
 const [totalSpots, setTotalSpots] = useState(0);
   const [totalInquiries, setTotalInquiries] = useState(0);
   const [monthlyInquiries, setMonthlyInquiries] = useState(0);
   const [registeredUsers, setRegisteredUsers] = useState(0);
   
  useEffect(() => {
        axios
          .get(`${BaseUrl}dashboard/count`, {
          })
          .then((res) => {
            setTotalSpots(res.data.total_spots);
            setTotalInquiries(res.data.total_inquiries);
            setMonthlyInquiries(res.data.monthly_inquiries);
            setRegisteredUsers(res.data.total_users);
          })
          .catch((err) => console.error(err));
    }, []);

    const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = Math.ceil(value / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count.toLocaleString()}</>;
};

  return (
    <HomeContainer>
      {/* HERO SECTION */}
      <HeroSection style={{ display: showPolicy ? "none" : "block" }}>
        <HeroTitle>{t("home.hero.title")}</HeroTitle>
        <HeroSubtitle>
          {t("home.hero.subtitle")}
        </HeroSubtitle>
        <CTAButton to="/suche">{t("home.hero.cta")}</CTAButton>
      </HeroSection>

      {/* MAIN CONTENT */}
      {!showPolicy && (
        <>
          {/* <FeaturesSection>
            <SectionTitle>{t("home.services.title")}</SectionTitle>
            <FeaturesGrid>
              <FeatureCard>
                <FeatureIcon>🔍</FeatureIcon>
                <FeatureTitle>{t("home.services.search.title")}</FeatureTitle>
                <FeatureDescription>
                  {t("home.services.search.desc")}
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>📋</FeatureIcon>
                <FeatureTitle>{t("home.services.details.title")}</FeatureTitle>
                <FeatureDescription>
                  {t("home.services.details.desc")}
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>📞</FeatureIcon>
                <FeatureTitle>{t("home.services.contact.title")}</FeatureTitle>
                <FeatureDescription>
                  {t("home.services.contact.desc")}
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>🏢</FeatureIcon>
                <FeatureTitle>{t("home.services.facilities.title")}</FeatureTitle>
                <FeatureDescription>
                  {t("home.services.facilities.desc")}
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </FeaturesSection> */}

          <StatsSection>
            <SectionTitle>{t("home.stats.title")}</SectionTitle>
            <StatsGrid>
              <StatItem>
                <StatNumber> <AnimatedNumber value={registeredUsers} /></StatNumber>
                <StatLabel>{t("home.stats.homes")}</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber> <AnimatedNumber value={totalSpots} /></StatNumber>
                <StatLabel>{t("home.stats.places")}</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber> <AnimatedNumber value={totalInquiries} /></StatNumber>
                <StatLabel>{t("home.stats.matches")}</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsSection>

          {/* <Footer>
            <FooterText>
              © {new Date().getFullYear()} PflegeFinder. {t("home.footer.rights")}
            </FooterText>
            <FooterText>
              <PrivacyLink onClick={() => setShowPolicy(true)}>
                {t("home.footer.privacy")}
              </PrivacyLink>
            </FooterText>
          </Footer> */}
        </>
      )}

      {/* PRIVACY POLICY */}
      {showPolicy && (
        <>
          <CloseButton onClick={() => setShowPolicy(false)}>{t("home.privacy.back")}</CloseButton>
          <PrivacyPage>
            <PolicyTitle>{t("home.privacy.title")}</PolicyTitle>

            <Section>
              <SubTitle>{t("home.privacy.intro_title")}</SubTitle>
              <Paragraph>
                {t("home.privacy.intro")}
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>{t("home.privacy.data_title")}</SubTitle>
              <Paragraph>
                {t("home.privacy.data")}
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>{t("home.privacy.usage_title")}</SubTitle>
              <Paragraph>
                {t("home.privacy.usage")}
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>{t("home.privacy.share_title")}</SubTitle>
              <Paragraph>
                {t("home.privacy.share")}
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>{t("home.privacy.cookies_title")}</SubTitle>
              <Paragraph>
                {t("home.privacy.cookies")}
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>{t("home.privacy.security_title")}</SubTitle>
              <Paragraph>
                {t("home.privacy.security")}
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>{t("home.privacy.contact_title")}</SubTitle>
              <Paragraph>
                {t("home.privacy.contact")}
              </Paragraph>
            </Section>
          </PrivacyPage>
        </>
      )}
    </HomeContainer>
  );
}

export default Home;
