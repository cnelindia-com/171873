import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TermsConditions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
const Wrapper = styled.div`
  min-height: 100vh;
  background: #fafafa;
  padding: 40px 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #1565c0;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Container = styled.div`
  max-width: 900px;
  margin: auto;
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SubTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #555;
`;

  return (
    <Wrapper>
      {/* <BackButton onClick={() => navigate(-1)}>
        ← {t("common.back")}
      </BackButton> */}

      <Container>
        <Title>{t("terms.title")}</Title>

        <Section>
          <SubTitle>{t("terms.intro_title")}</SubTitle>
          <Text>{t("terms.intro")}</Text>
        </Section>

        <Section>
          <SubTitle>{t("terms.use_title")}</SubTitle>
          <Text>{t("terms.use")}</Text>
        </Section>

        <Section>
          <SubTitle>{t("terms.account_title")}</SubTitle>
          <Text>{t("terms.account")}</Text>
        </Section>

        <Section>
          <SubTitle>{t("terms.payment_title")}</SubTitle>
          <Text>{t("terms.payment")}</Text>
        </Section>

        <Section>
          <SubTitle>{t("terms.termination_title")}</SubTitle>
          <Text>{t("terms.termination")}</Text>
        </Section>

        <Section>
          <SubTitle>{t("terms.liability_title")}</SubTitle>
          <Text>{t("terms.liability")}</Text>
        </Section>
      </Container>
    </Wrapper>
  );
};

export default TermsConditions;
