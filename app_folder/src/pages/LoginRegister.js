import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { BaseUrl } from "../BaseUrl";
import "../css/theme.css"; // ✅ Theme import
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// ====================== STYLES ======================
const Container = styled.div`
  max-width: 460px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-background);
  font-family: var(--font-base);
`;

const FormCard = styled.div`
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 15px;
  width: 25.5rem;
  box-shadow: 0 5px 15px var(--color-shadow);
`;

const Title = styled.h1`
  color: var(--color-text-main);
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: var(--color-text-main);
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const Button = styled.button`
  background-color: var(--color-dark-background);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const ToggleSection = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
`;

const ToggleText = styled.span`
  color: #7f8c8d;
  margin-right: 0.5rem;
`;

const ToggleButton = styled.button`
  background-color: transparent;
  color: var(--color-primary);
  border: none;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;

  &:hover {
    color: var(--color-primary-dark);
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--color-error-light, #f8d7da);
  color: var(--color-error);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  background-color: var(--color-success-light, #d4edda);
  color: var(--color-success);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  cursor: pointer;
  color: #7f8c8d;
  font-size: 1.1rem;

  &:hover {
    color: var(--color-primary);
  }
`;

// ====================== MAIN COMPONENT ======================
function LoginRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/register") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    facilityName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    address_street: "",
    address_postcode: "",
    address_city: "",
    country: "",
    acceptTerms: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Redirect if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("pflegeLoggedIn");
    if (isLoggedIn) navigate("/dashboard");
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
    setSuccess("");
  };


  // ✅ API Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

     // ✅ PASSWORD CONFIRM CHECK (REGISTER ONLY)
  if (!isLogin && formData.password !== formData.confirmPassword) {
    setError("Passwort und Bestätigung stimmen nicht überein!");
    return;
  }

    try {
      if (isLogin) {
        // ---------- LOGIN ----------
        const response = await axios.post(`${BaseUrl}login`, {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        if (response.data.success || response.data.status === true) {
          const user = response.data.user || response.data.data || {};
          const token = response.data.token || response.data.access_token || null;

          // ✅ Save user details
          localStorage.setItem("pflegeLoggedIn", "true");
          localStorage.setItem("pflegeUserEmail", user.email);
          localStorage.setItem("pflegeUserName", user.name);
          localStorage.setItem("pflegeUserId", user.id);
          localStorage.setItem("pflegeUsertype", user.user_type);
          localStorage.setItem("pflegeCurrentPlan", user.current_plan);
          localStorage.setItem("pflegePlanStatus", user.plan_status);
          const lang = localStorage.getItem("lang") || "de";
          localStorage.setItem("lang", lang);

          if (token) localStorage.setItem("pflegeUserToken", token);

          navigate("/dashboard");
        } else {
          setError(response.data.message || t("auth.login_failed"));
        }
      } else {
        // ---------- REGISTER ----------
        const response = await axios.post(`${BaseUrl}register`, {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          facility_name: formData.facilityName.trim(),
          phone: formData.phone.trim(),
          address_street: formData.address_street.trim(),
          address_postcode: formData.address_postcode.trim(),
          address_city: formData.address_city.trim(),
          country: formData.country.trim(),
          password_confirmation: formData.confirmPassword,
        });


        if (response.data.success || response.data.status === true) {
          const user = response.data.user || response.data.data || {};
          const token = response.data.token || response.data.access_token || null;

          localStorage.setItem("pflegeLoggedIn", "true");
          localStorage.setItem("pflegeUserEmail", user.email);
          localStorage.setItem("pflegeUserName", user.name);
          localStorage.setItem("pflegeUserId", user.id);
          localStorage.setItem("pflegeUsertype", user.user_type);
          localStorage.setItem("pflegeCurrentPlan", user.current_plan);
          localStorage.setItem("pflegePlanStatus", user.plan_status);
          const lang = localStorage.getItem("lang") || "de";
          localStorage.setItem("lang", lang);
          
          if (token) localStorage.setItem("pflegeUserToken", token);

          setSuccess("Registrierung erfolgreich! Weiterleitung...");
          setTimeout(() => navigate("/dashboard"), 1500);
        } else {
          setError(response.data.message || t("auth.registration_failed"));
        }
      }
    } catch (err) {
      console.error("API ERROR:", err);
      if (err.response) {
        setError(err.response.data.message || "Fehler bei der Anmeldung!");
      } else {
        setError("Serverfehler oder Verbindung unterbrochen!");
      }
    }
  };
  const toggleMode = () => {
    setError("");
    setSuccess("");
    setFormData({ name: "", email: "", password: "" });

    if (isLogin) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };


  return (
    <Container>
      <FormCard>
        <Title>{isLogin ? t("auth.login_title") : t("auth.register_title")}</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <FormGroup>
              <Label>
                {t("auth.name")} <span style={{ color: "red" }}>*</span>
              </Label>
              <Wrapper>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              </Wrapper>
            </FormGroup>
          )}
          {!isLogin && (
            <FormGroup>
              <Label>
                {t("auth.facility_name")} <span style={{ color: "red" }}>*</span>
              </Label>
              <Wrapper>

              <Input
                type="text"
                name="facilityName"
                value={formData.facilityName}
                onChange={handleInputChange}
                required
              />
              </Wrapper>
            </FormGroup>
          )}

          {!isLogin && (
            <FormGroup>
              <Label>
                {t("auth.phone")} <span style={{ color: "red" }}>*</span>
              </Label>
              <Wrapper>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              </Wrapper>
            </FormGroup>
          )}


          {!isLogin && (
            <FormGroup>
              <Label>
                {t("auth.street")} <span style={{ color: "red" }}>*</span>
              </Label>
              <Wrapper>

              <Input
                type="text"
                name="address_street"
                value={formData.address_street}
                onChange={handleInputChange}
                required
              />
              </Wrapper>
            </FormGroup>
          )}

          {!isLogin && (
            <FormGroup>
              <Label>
                {t("auth.postcode")} <span style={{ color: "red" }}>*</span>
              </Label>
              <Wrapper>
              <Input
                type="text"
                name="address_postcode"
                value={formData.address_postcode}
                onChange={handleInputChange}
                required
              />
              </Wrapper>
            </FormGroup>
          )}

          {!isLogin && (
            <FormGroup>
              <Label>
                {t("auth.city")} <span style={{ color: "red" }}>*</span>
              </Label>
              <Wrapper>
              <Input
                type="text"
                name="address_city"
                value={formData.address_city}
                onChange={handleInputChange}
                required
              />
              </Wrapper>
            </FormGroup>
          )}

          {!isLogin && (
            <FormGroup>
              <Label>
                {t("auth.country")} <span style={{ color: "red" }}>*</span>
              </Label>
              <Wrapper>
              <Input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
              </Wrapper>
            </FormGroup>
          )}





          <FormGroup>
            <Label>
              {t("auth.email")} <span style={{ color: "red" }}>*</span>
            </Label>
            <Wrapper>
              
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            </Wrapper>
          </FormGroup>

          {/* <FormGroup>
            <Label>
              {t("auth.password")} <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </FormGroup> */}
          <FormGroup>
          <Label>
            {t("auth.password")} <span style={{ color: "red" }}>*</span>
          </Label>

          <Wrapper>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <EyeIcon onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </EyeIcon>
          </Wrapper>
        </FormGroup>

          {/* {!isLogin && (
            <FormGroup>
              <Label>
                {t("auth.confirm_password")} <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          )} */}
          {!isLogin && (
          <FormGroup>
            <Label>
              {t("auth.confirm_password")} <span style={{ color: "red" }}>*</span>
            </Label>

            <Wrapper>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </Wrapper>
          </FormGroup>
        )}

          {!isLogin && (
            <FormGroup>
              <label style={{ display: "flex", gap: "0.5rem", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  required
                />
                {t("auth.accept_terms")}{" "}
                <span style={{ color: "var(--color-primary)", cursor: "pointer" }}>
                  {t("auth.terms_and_privacy")}
                </span>
              </label>
            </FormGroup>
          )}
          <Button type="submit">{isLogin ? t("auth.login") : t("auth.register")}</Button>
        </Form>

        <ToggleSection>
          <ToggleText>{isLogin ? t("auth.no_account") : t("auth.have_account")}</ToggleText>
          <ToggleButton type="button" onClick={toggleMode}>
            {isLogin ? t("auth.register_now") : t("auth.go_login")}
          </ToggleButton>
        </ToggleSection>

        {!isLogin && (
          <div
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.9rem",
              color: "#7f8c8d",
            }}
          >
            <p>* {t("auth.required")}</p>
          </div>
        )}
      </FormCard>
    </Container>
  );
}

export default LoginRegister;
