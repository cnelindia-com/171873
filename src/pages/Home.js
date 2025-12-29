import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "../css/theme.css"; // ✅ Theme import (path adjust करें अगर folder अलग है)

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
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
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
  background-color: var(--color-background);
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
  padding: 1.5rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #777;
  font-size: 1.1rem;
`;

const Footer = styled.footer`
  background-color: var(--color-primary-dark);
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
  const [showPolicy, setShowPolicy] = useState(false);

  return (
    <HomeContainer>
      {/* HERO SECTION */}
      <HeroSection style={{ display: showPolicy ? "none" : "block" }}>
        <HeroTitle>Willkommen bei PflegeFinder</HeroTitle>
        <HeroSubtitle>
          Finden Sie schnell und einfach verfügbare Pflegeheim-Plätze in Ihrer Nähe
        </HeroSubtitle>
        <CTAButton to="/suche">Jetzt suchen</CTAButton>
      </HeroSection>

      {/* MAIN CONTENT */}
      {!showPolicy && (
        <>
          <FeaturesSection>
            <SectionTitle>Unsere Services</SectionTitle>
            <FeaturesGrid>
              <FeatureCard>
                <FeatureIcon>🔍</FeatureIcon>
                <FeatureTitle>Einfache Suche</FeatureTitle>
                <FeatureDescription>
                  Finden Sie Pflegeheime nach PLZ, Stadt oder spezifischen Kriterien
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>📋</FeatureIcon>
                <FeatureTitle>Detaillierte Informationen</FeatureTitle>
                <FeatureDescription>
                  Alle wichtigen Details zu Pflegestufen, Zimmern und Verfügbarkeiten
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>📞</FeatureIcon>
                <FeatureTitle>Direkter Kontakt</FeatureTitle>
                <FeatureDescription>
                  Kontaktieren Sie Pflegeheime direkt über unser Kontaktformular
                </FeatureDescription>
              </FeatureCard>

              <FeatureCard>
                <FeatureIcon>🏢</FeatureIcon>
                <FeatureTitle>Für Pflegeheime</FeatureTitle>
                <FeatureDescription>
                  Verwalten Sie Ihre verfügbaren Plätze und erreichen Sie neue Bewohner
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </FeaturesSection>

          <StatsSection>
            <SectionTitle>Erfolge in Zahlen</SectionTitle>
            <StatsGrid>
              <StatItem>
                <StatNumber>500+</StatNumber>
                <StatLabel>Registrierte Pflegeheime</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>10,000+</StatNumber>
                <StatLabel>Verfügbare Plätze</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>50,000+</StatNumber>
                <StatLabel>Hilfreiche Vermittlungen</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsSection>

          <Footer>
            <FooterText>
              © {new Date().getFullYear()} PflegeFinder. Alle Rechte vorbehalten.
            </FooterText>
            <FooterText>
              <PrivacyLink onClick={() => setShowPolicy(true)}>
                Datenschutzerklärung
              </PrivacyLink>
            </FooterText>
          </Footer>
        </>
      )}

      {/* PRIVACY POLICY */}
      {showPolicy && (
        <>
          <CloseButton onClick={() => setShowPolicy(false)}>Zurück</CloseButton>
          <PrivacyPage>
            <PolicyTitle>Datenschutzerklärung</PolicyTitle>

            <Section>
              <SubTitle>1. Einführung</SubTitle>
              <Paragraph>
                Willkommen bei PflegeFinder – Pflegeheim Plätze finden. Der Schutz Ihrer
                persönlichen Daten ist uns sehr wichtig.
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>2. Datenerhebung</SubTitle>
              <Paragraph>
                Wir erfassen personenbezogene Daten wie Name, E-Mail-Adresse und
                Telefonnummer, wenn Sie unsere Dienste nutzen.
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>3. Verwendung der Daten</SubTitle>
              <Paragraph>
                Ihre Daten werden ausschließlich dazu verwendet, Pflegeheime zu finden und
                Ihre Anfragen zu beantworten.
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>4. Weitergabe der Daten</SubTitle>
              <Paragraph>
                Wir geben Ihre Daten nicht an Dritte weiter, außer wenn dies gesetzlich
                erforderlich ist.
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>5. Cookies</SubTitle>
              <Paragraph>
                Diese Website verwendet Cookies zur Verbesserung der Benutzererfahrung. Sie
                können Cookies jederzeit in Ihrem Browser deaktivieren.
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>6. Sicherheit</SubTitle>
              <Paragraph>
                Wir setzen moderne Sicherheitsmaßnahmen ein, um Ihre Daten vor Missbrauch
                oder unbefugtem Zugriff zu schützen.
              </Paragraph>
            </Section>

            <Section>
              <SubTitle>7. Kontakt</SubTitle>
              <Paragraph>Bei Fragen wenden Sie sich an: info@pflegefinder.de</Paragraph>
            </Section>
          </PrivacyPage>
        </>
      )}
    </HomeContainer>
  );
}

export default Home;
