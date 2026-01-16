import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiCubeTransparent, HiHome } from "react-icons/hi";
import { HiLocationMarker } from "react-icons/hi";
import { HiChartBar } from "react-icons/hi";
import { HiCreditCard } from "react-icons/hi";
import { HiUser } from "react-icons/hi";
import { HiLogout } from "react-icons/hi";
import { HiClipboardList } from "react-icons/hi";

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
import { useTranslation } from 'react-i18next';

const SidebarMenu = ({
  userName,
  activeSection,
  setActiveSection,
  handleLogout,
}) => {
  const navigate = useNavigate();
    const { t } = useTranslation();
  const [userType, setUserType] = useState(null); // 2 = admin
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);

  const token = localStorage.getItem("pflegeUserToken");

  const goTo = (section, path) => {
    setActiveSection(section);
    navigate(path);
  };

  /* ===== Get user type ===== */
  useEffect(() => {
    setUserType(localStorage.getItem("pflegeUsertype"));
  }, []);

  useEffect(() => {
  if (!token || userType === "2") return;

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
}, [token, userType]);

  /* ===== Conditions ===== */
  const isAdmin = userType === "2";
  const isEnterprise = currentPlan === "enterprise";

  return (
    <Sidebar>
      <SidebarHeader>
        {/* <SidebarTitle>{t("sidebar.menu.title")}</SidebarTitle> */}
        <SidebarSubtitle>{userName}</SidebarSubtitle>
      </SidebarHeader>

      <SidebarMenuWrapper>
        <MenuItem
          active={activeSection === "dashboard"}
          onClick={() => goTo("dashboard", "/dashboard")}
        >
          <MenuIcon /><HiHome />{t("sidebar.menu.dashboard")}
        </MenuItem>

        <MenuItem
          active={activeSection === "spots"}
          onClick={() => goTo("spots", "/dashboard/places")}
        >
          <MenuIcon /><HiLocationMarker />{t("sidebar.menu.places")}
        </MenuItem>

        {/* 🔥 LEADS: Admin OR Enterprise users */}
        {(isAdmin || (isEnterprise && currentStatus == "active")) && (
        <MenuItem
          active={activeSection === "leads"}
          onClick={() => goTo("leads", "/dashboard/leads")}
        >
          <MenuIcon /><HiChartBar />{t("sidebar.menu.leads")}
        </MenuItem>
      )}


       {userType !== "2" && (
        <MenuItem
          active={activeSection === "subscription"}
          onClick={() => goTo("subscription", "/dashboard/subscription")}
        >
         <MenuIcon /><HiCreditCard />{t("sidebar.menu.subscription")}
        </MenuItem>
      )}
       {userType == "2" && (
        <MenuItem
          active={activeSection === "subscription_list"}
          onClick={() => goTo("subscription_list", "/dashboard/subscription_list")}
        >
         <MenuIcon /><HiCreditCard />{t("sidebar.menu.subscription_list")}
        </MenuItem>
      )}

      {/* 🔥 LEADS: Admin OR Enterprise users */}
        {(isAdmin) && (
        <MenuItem
          active={activeSection === "activity-logs"}
          onClick={() => goTo("activity-logs", "/dashboard/activity-logs")}
        >
          <MenuIcon /><HiClipboardList /> {t("sidebar.menu.activity_logs")}
        </MenuItem>
      )}

        <MenuItem
          active={activeSection === "profile"}
          onClick={() => goTo("profile", "/dashboard/profile")}
        >
          <MenuIcon /><HiUser /> {t("sidebar.menu.profile")}
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <MenuIcon /><HiLogout /> {t("sidebar.menu.logout")}
        </MenuItem>
      </SidebarMenuWrapper>
    </Sidebar>
  );
};

export default SidebarMenu;
