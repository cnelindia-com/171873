import React, { useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import styled from "styled-components";

// Add this mapping at the top of your component file
const careOptionsMap = {
  1: "Stufe 1",           // Full Care
  2: "Stufe 2", // Partial Care
  3: "Stufe 3"           // Basic Care
};
// Styled Components
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  background-color: var(--color-surface);
  box-shadow: 0 2px 8px var(--color-shadow);
`;

const Title = styled.h3`
  margin-bottom: 1rem;
  text-align: center;
  color: var(--color-text-main);
  font-size: var(--h3-size);
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: var(--btn-radius);
  font-size: var(--body-size);
  font-family: var(--font-base);
  transition: all 0.2s;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 5px rgba(21, 101, 192, 0.3);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: var(--btn-radius);
  font-size: var(--body-size);
  font-family: var(--font-base);
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 5px rgba(21, 101, 192, 0.3);
    outline: none;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: var(--btn-radius);
  font-size: var(--body-size);
  font-family: var(--font-base);
  transition: all 0.2s;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 5px rgba(21, 101, 192, 0.3);
    outline: none;
  }
`;

const Button = styled.button`
  padding: var(--btn-padding-y) var(--btn-padding-x);
  background-color: var(--color-primary);
  color: #fff;
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--btn-radius);
  cursor: pointer;
  font-size: var(--btn-font-size);
  font-family: var(--font-base);
  text-transform: uppercase;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    background-color: #E0E0E0;
    color: #9E9E9E;
    cursor: not-allowed;
  }
`;

const MessageBox = styled.div`
  padding: 0.75rem 1rem;
  border-radius: var(--btn-radius);
  background-color: ${props => (props.error ? "var(--color-error)" : "var(--color-success)")};
  color: #fff;
  font-weight: var(--font-weight-medium);
`;

export default function InquiryForm({ facilityId, careOptions = [] }) {
const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  care_type: "",
  message: "",
});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]{6,20}$/;

  const validate = () => {
    if (!form.name || !form.email || !form.phone) {
      setError("Bitte füllen Sie alle Pflichtfelder aus.");
      return false;
    }
    if (!emailRegex.test(form.email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return false;
    }
    if (!phoneRegex.test(form.phone)) {
      setError("Bitte geben Sie eine gültige Telefonnummer ein.");
      return false;
    }
    setError("");
    return true;
  };

  const submit = async () => {
  if (!validate()) return;

  try {
    await axios.post(`${BaseUrl}send-inquiry`, {
      facility_id: facilityId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    });

    setSuccess(true);
  } catch (err) {
    console.error(err);
    setError("Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.");
  }
};



  if (success) {
    return <MessageBox>Vielen Dank, Ihre Anfrage wurde erfolgreich gesendet.</MessageBox>;
  }

  return (
    <FormWrapper>
      <Title>Anfrage senden</Title>

      {error && <MessageBox error>{error}</MessageBox>}

      <Input
        placeholder="Vollständiger Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        placeholder="E-Mail"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />
      <Input
        placeholder="Telefonnummer"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        required
      />

      <Select
  value={form.care_type}
  onChange={e => setForm({ ...form, care_type: e.target.value })}
  required
>
  <option value="">Pflegeart auswählen</option>
  {Array.isArray(careOptions) && careOptions.map((option, idx) => (
    <option key={idx} value={option}>
      {careOptionsMap[option] || option} {}
    </option>
  ))}
</Select>

      <TextArea
        placeholder="Nachricht (optional)"
        rows={4}
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
      />

      <Button onClick={submit}>Senden</Button>
    </FormWrapper>
  );
}
