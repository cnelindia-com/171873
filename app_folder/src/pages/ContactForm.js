import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { BaseUrl } from "../BaseUrl";

import "../css/theme.css"; // ✅ Theme import

// ===== Styled Components =====
const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: var(--font-base);
  color: var(--color-text-main);
`;

const FormCard = styled.div`
  background: var(--color-surface);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px var(--color-shadow);
`;

const Title = styled.h1`
  color: var(--color-text-main);
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.6rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  text-align: center;
  color: var(--color-text-secondary, #7f8c8d);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: var(--color-text-main);
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1.8px solid var(--color-shadow);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-background);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.15);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1.8px solid var(--color-shadow);
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  background: var(--color-background);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.15);
  }
`;

const Button = styled.button`
  background: var(--color-primary);
  color: #fff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
  }
`;

const SuccessMessage = styled.div`
  background: rgba(46, 125, 50, 0.15);
  color: var(--color-success);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid var(--color-success);
  font-weight: 500;
`;

const BackButton = styled.button`
  background: var(--color-background);
  color: var(--color-text-main);
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-shadow);
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

// ===== Main Component =====
function ContactForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    const facilities = JSON.parse(localStorage.getItem("facilities") || "[]");
    const foundFacility = facilities.find((f) => f.id === parseInt(id));
    setFacility(foundFacility);

    const isLoggedIn = localStorage.getItem("pflegeLoggedIn");
    if (isLoggedIn) {
      const userEmail = localStorage.getItem("pflegeUserEmail");
      const users = JSON.parse(localStorage.getItem("pflegeUsers") || "[]");
      const currentUser = users.find((u) => u.email === userEmail);

      if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
        }));
      }
    }
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BaseUrl}send-inquiry`, {
        facility_id: parseInt(id),
        facility_name: facility?.name,
        ...formData,
      });

      setSubmitted(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      alert("Fehler beim Senden der Nachricht!");
    }
  };

  const handleGoBack = () => navigate(-1);

  if (!facility) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Lädt...</div>;
  }

  return (
    <Container>
      <FormCard>
        <Title>Kontaktieren Sie uns</Title>
        <Subtitle>
          Sie kontaktieren: <strong>{facility.name}</strong>
        </Subtitle>

        {submitted && (
          <SuccessMessage>
            Vielen Dank für Ihre Anfrage! Ihre Nachricht wurde erfolgreich
            gesendet. Das Pflegeheim wird sich bald bei Ihnen melden.
          </SuccessMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Ihr Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>E-Mail-Adresse *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Telefonnummer</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Ihre Nachricht *</Label>
            <TextArea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Bitte beschreiben Sie Ihr Anliegen..."
              required
            />
          </FormGroup>

          <Button type="submit">Nachricht senden</Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <BackButton onClick={handleGoBack}>Zurück</BackButton>
        </div>
      </FormCard>
    </Container>
  );
}

export default ContactForm;
