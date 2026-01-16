import React, { useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import styled from "styled-components";
import { useTranslation } from "react-i18next"; // use i18next
// Add this mapping at the top of your component file
// const careOptionsMap = {
//   1: "Basic",           // Full Care
//   2: "Demenz", // Partial Care
//   3: "intensiv",           // Basic Care
//   4: "kurzfristig"        // Specialized Care
// };
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
  const { t } = useTranslation(); // t("key.path") returns current language text
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
      setError(t("inquiry.errors.required_fields"));
      return false;
    }
    if (!emailRegex.test(form.email)) {
      setError(t("inquiry.errors.invalid_email"));
      return false;
    }
    if (!phoneRegex.test(form.phone)) {
      setError(t("inquiry.errors.invalid_phone"));
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
      setError(t("inquiry.errors.generic"));
    }
  };



  if (success) {
    return <MessageBox>{t("inquiry.success")}</MessageBox>;
  }

  return (
    <FormWrapper>
      <Title>{t("inquiry.title")}</Title>

      {error && <MessageBox error>{error}</MessageBox>}

      <Input
        placeholder={t("inquiry.placeholders.name")}
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        placeholder={t("inquiry.placeholders.email")}
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />
      <Input
        placeholder={t("inquiry.placeholders.phone")}
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        required
      />
      <Select
        value={form.care_type}
        onChange={e => setForm({ ...form, care_type: e.target.value })}
        required
      >
        <option value="">{t("inquiry.placeholders.care_type")}</option>

        {Array.isArray(careOptions) &&
          careOptions.map((option) => (
            <option key={option} value={option}>
              {t(`details.care_levels.${option}`)}
            </option>
          ))}
      </Select>


      <TextArea
        placeholder={t("inquiry.placeholders.message")}
        rows={4}
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
      />

      <Button onClick={submit}>{t("inquiry.submit")}</Button>
    </FormWrapper>
  );
}
