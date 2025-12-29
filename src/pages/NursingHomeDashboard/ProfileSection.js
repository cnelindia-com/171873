import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import "../../css/theme.css"; // ✅ Theme variables import
import {
  MainContent,
} from "./StyledComponents";
// ====== Styled Components ======
const Card = styled.div`
  background: var(--color-surface);
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 5px 15px var(--color-shadow);
  color: var(--color-text-main);
  font-family: var(--font-base);
`;

const TwoColumn = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  flex-wrap: wrap;
`;

const Column = styled.div`
  flex: 1;
  min-width: 300px;
`;

const FormTitle = styled.h3`
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-main);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-main);
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  padding: 0.6rem 0.75rem;
  font-size: 0.9rem;
  border: 1.5px solid #d0d7e2;
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text-main);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.15);
  }

  &:read-only {
    background: #f4f6f8;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  background-color: var(--color-primary);
  color: #fff;
  font-weight: 600;
  padding: 0.7rem 1.8rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: block;
  margin: 25px auto 0 auto;
  width: auto;
  transition: background 0.25s ease, transform 0.1s ease;

  &:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const MessageBox = styled.div`
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1.2rem;
  font-weight: 500;
  font-size: 0.9rem;
  background: ${(p) =>
    p.type === "success"
      ? "rgba(46, 125, 50, 0.15)"
      : "rgba(211, 47, 47, 0.15)"};
  color: ${(p) =>
    p.type === "success"
      ? "var(--color-success)"
      : "var(--color-error)"};
  border: 1px solid
    ${(p) =>
      p.type === "success"
        ? "var(--color-success)"
        : "var(--color-error)"};
`;

// ====== Component ======
const ProfileSection = () => {
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("pflegeUserToken");
  const userId = localStorage.getItem("pflegeUserId");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.get(`${BaseUrl}get-profile`, {
          params: { user_id: userId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data?.data || res.data?.user || res.data;

        setEditData({
          username: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchProfile();
  }, []);

  // 🔥 Single Save Button Logic
  const handleSaveAll = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.put(
        `${BaseUrl}update-profile`,
        { user_id: userId, name: editData.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (
        passwords.currentPassword ||
        passwords.newPassword ||
        passwords.confirmPassword
      ) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          setMessage({
            type: "error",
            text: "Passwortbestätigung stimmt nicht überein!",
          });
          setLoading(false);
          return;
        }

        await axios.put(
          `${BaseUrl}change-password`,
          {
            user_id: userId,
            old_password: passwords.currentPassword,
            new_password: passwords.newPassword,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setMessage({
        type: "success",
        text: "Alle Änderungen wurden gespeichert!",
      });
    } catch (e) {
      setMessage({
        type: "error",
        text: "Änderungen konnten nicht gespeichert werden!",
      });
    }

    setLoading(false);
  };

  return (
    <MainContent>

    <Card>
      {message.text && (
        <MessageBox type={message.type}>{message.text}</MessageBox>
      )}

      <TwoColumn>
        {/* LEFT: PROFILE */}
        <Column>
          <FormTitle>Profil bearbeiten</FormTitle>

          <FormGroup>
            <Label>Name</Label>
            <Input
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input value={editData.email} readOnly />
          </FormGroup>

          <FormGroup>
            <Label>Telefonnummer</Label>
            <Input value={editData.phone} readOnly />
          </FormGroup>
        </Column>

        {/* RIGHT: PASSWORD */}
        <Column>
          <FormTitle>Passwort ändern</FormTitle>

          <FormGroup>
            <Label>Aktuelles Passwort</Label>
            <Input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  currentPassword: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Neues Passwort</Label>
            <Input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  newPassword: e.target.value,
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Neues Passwort bestätigen</Label>
            <Input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirmPassword: e.target.value,
                })
              }
            />
          </FormGroup>
        </Column>
      </TwoColumn>

      {/* SINGLE SAVE BUTTON */}
      <Button onClick={handleSaveAll}>
        {loading ? "Bitte warten..." : "Änderungen speichern"}
      </Button>
    </Card>
    </MainContent>
  );
};

export default ProfileSection;
