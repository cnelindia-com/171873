import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import "../../css/theme.css";
import { MainContent } from "./StyledComponents";
import { useTranslation } from "react-i18next";
import avatar from  "./default-avatar.jpg";
import { ImageUrl } from "../.././BaseUrl";
/* ================= STYLES ================= */

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background: linear-gradient(135deg, #eef1f7, #f8f9fc);
  padding: 3rem;
  border-radius: 18px;
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
`;

const Left = styled.div`
  width: 220px;
  text-align: center;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const ChangeImageBtn = styled.button`
  background: #4c8dad;
  color: #fff;
  border: none;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Right = styled.div`
  flex: 1;
  background: #ffffff;
  padding: 2rem;
  border-radius: 14px;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1.8rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1.5px solid #d0d7e2;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #4c8dad;
  }

  &:read-only {
    background: #f2f4f7;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.8rem;
`;

const SaveBtn = styled.button`
  background: #4c8dad;
  color: #fff;
  border: none;
  padding: 0.6rem 1.6rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #3c7895;
  }
`;

const CancelBtn = styled.button`
  background: #d9534f;
  color: #fff;
  border: none;
  padding: 0.6rem 1.6rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #c9302c;
  }
`;

const Message = styled.div`
  margin-bottom: 1rem;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: ${(p) => (p.type === "success" ? "#2e7d32" : "#c62828")};
  background: ${(p) =>
    p.type === "success"
      ? "rgba(46,125,50,0.12)"
      : "rgba(198,40,40,0.12)"};
`;

/* ================= COMPONENT ================= */

const ProfileSection = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  const [original, setOriginal] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem("pflegeUserToken");
  const userId = localStorage.getItem("pflegeUserId");

  useEffect(() => {
    const loadProfile = async () => {
      const res = await axios.get(`${BaseUrl}get-profile`, {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data?.data || res.data;
      // console.log(user);
      const data = {
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
       image: user.image
      ? `${ImageUrl.replace('/api/', '')}storage/${user.image}`
      : avatar
          };

      setForm(data);
      setOriginal(data);
    };

    loadProfile();
  }, []);


 const handleSave = async () => {
  if (form.password && form.password !== form.confirmPassword) {
    setMessage({
      type: "error",
      text: t("profile.messages.password_mismatch"),
    });
    return;
  }

  try {
    setLoading(true);

    // ✅ update name
    await axios.put(
      `${BaseUrl}update-profile`,
      { user_id: userId, name: form.name },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ upload image (THIS WAS MISSING)
    if (imageFile) {
      await uploadProfileImage();
    }

    // ✅ update password
    if (form.password) {
      await axios.put(
        `${BaseUrl}change-password`,
        {
          new_password: form.password,
          new_password_confirmation: form.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setMessage({
      type: "success",
      text: t("profile.messages.success"),
    });
  } catch (err) {
    console.error(err);
    setMessage({
      type: "error",
      text: t("profile.messages.error"),
    });
  } finally {
    setLoading(false);
  }
};

const uploadProfileImage = async () => {
  if (!imageFile) return;

  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("image", imageFile);

  await axios.post(
    `${BaseUrl}update-profile-image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};




  const handleCancel = () => {
    setForm(original);
    setMessage(null);
  };

  return (
    <MainContent>
      <Wrapper>
        <Card>
          {/* LEFT */}
          <Left>
            <Avatar src={form.image} />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="profileImageInput"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setImageFile(file);
                setForm({
                  ...form,
                  image: URL.createObjectURL(file),
                });
              }}
            />
            <ChangeImageBtn onClick={() => document.getElementById("profileImageInput").click()}>
            {t("profile.buttons.change_image")}
          </ChangeImageBtn>

          </Left>

          {/* RIGHT */}
          <Right>
            {/* <Title>{t("profile.edit_title")}</Title> */}


            {message && <Message type={message.type}>{message.text}</Message>}

            <FormGroup>
              <Label>{t("profile.labels.name")}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
             <Label>{t("profile.labels.email")}</Label>
              <Input value={form.email} readOnly />
            </FormGroup>

            <FormGroup>
             <Label>{t("profile.labels.new_password")}</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label>{t("profile.labels.confirm_password")}</Label>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </FormGroup>

            <ButtonRow>
             <SaveBtn onClick={handleSave} disabled={loading}>
              {loading ? t("profile.buttons.loading") : t("profile.buttons.save")}
            </SaveBtn>
             <CancelBtn onClick={handleCancel}>
              {t("profile.buttons.cancel")}
            </CancelBtn>
            </ButtonRow>
          </Right>
        </Card>
      </Wrapper>
    </MainContent>
  );
};

export default ProfileSection;
