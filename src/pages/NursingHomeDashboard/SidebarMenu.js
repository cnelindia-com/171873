import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarHeader,
  SidebarTitle,
  SidebarSubtitle,
  SidebarMenu as SidebarMenuWrapper,
  MenuItem,
  MenuIcon,
} from "./StyledComponents";
import { BaseUrl } from "../../BaseUrl";

const SidebarMenu = ({
  userName,
  activeSection,
  setActiveSection,
  handleLogout,
}) => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState(null); // 2 = admin
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);

  const token = localStorage.getItem("token");

  const goTo = (section, path) => {
    setActiveSection(section);
    navigate(path);
  };

  /* ===== Get user type ===== */
  useEffect(() => {
    setUserType(localStorage.getItem("pflegeUsertype"));
  }, []);

  /* ===== Fetch current subscription ===== */
  useEffect(() => {
    if (!token) return;

    fetch(`${BaseUrl}stripe/current-subscription`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentPlan(data?.planName?.toLowerCase() || null);
        setCurrentStatus(data?.status || null);
      })
      .catch((err) => console.error("Subscription error:", err));
  }, [token]);

  /* ===== Conditions ===== */
  const isAdmin = userType === "2";
  const isEnterprise = currentPlan === "enterprise";

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTitle>Armaturenbrett</SidebarTitle>
        <SidebarSubtitle>{userName}</SidebarSubtitle>
      </SidebarHeader>

      <SidebarMenuWrapper>
        <MenuItem
          active={activeSection === "dashboard"}
          onClick={() => goTo("dashboard", "/dashboard")}
        >
          <MenuIcon /> Überblick
        </MenuItem>

        <MenuItem
          active={activeSection === "spots"}
          onClick={() => goTo("spots", "/dashboard/places")}
        >
          <MenuIcon /> Meine Orte
        </MenuItem>

        {/* 🔥 LEADS: Admin OR Enterprise users */}
        {(isAdmin || isEnterprise && currentStatus === "active") && (
          <MenuItem
            active={activeSection === "leads"}
            onClick={() => goTo("leads", "/dashboard/leads")}
          >
            <MenuIcon /> Leads & Analysen
          </MenuItem>
        )}

        <MenuItem
          active={activeSection === "subscription"}
          onClick={() => goTo("subscription", "/dashboard/subscription")}
        >
          <MenuIcon /> Abonnement
        </MenuItem>

        <MenuItem
          active={activeSection === "profile"}
          onClick={() => goTo("profile", "/dashboard/profile")}
        >
          <MenuIcon /> Profileinstellungen
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <MenuIcon /> Abmelden
        </MenuItem>
      </SidebarMenuWrapper>
    </Sidebar>
  );
};

export default SidebarMenu;
