import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FooterContainer = styled.footer`
  background: linear-gradient(180deg, #1f2f44 0%, #1a2738 100%);
  padding: 16px 0;
  text-align: center;
  color: #cfd8dc;
  font-size: 0.9rem;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FooterLink = styled(Link)`
text-decoration: none;
  color: #cfd8dc;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`;

const Separator = styled.span`
  opacity: 0.6;
`;
const FooterText = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
`;

function Footer() {
  const { t } = useTranslation();

  return (
    <FooterContainer>
      <FooterText>
              © {new Date().getFullYear()} PflegeFinder. {t("home.footer.rights")}
            </FooterText>
      <FooterLinks>
        <FooterLink to="/#">{t("footer.imprint")}</FooterLink>
        <Separator>|</Separator>
        <FooterLink to="/privacy">{t("footer.privacy")}</FooterLink>
        <Separator>|</Separator>
        <FooterLink to="/terms">{t("footer.terms")}</FooterLink>
      </FooterLinks>
    </FooterContainer>
  );
}

export default Footer;
