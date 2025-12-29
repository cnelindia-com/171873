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

const SidebarMenu = ({ userName, activeSection, setActiveSection, handleLogout }) => {
  const [userType, setUserType] = useState(null);
const goTo = (section, path) => {
    setActiveSection(section);
    navigate(path);
  };

  useEffect(() => {
    const type = localStorage.getItem("pflegeUsertype");
    setUserType(type);
  }, []); // run once on mount
const navigate = useNavigate();
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
          onClick={() => goTo("spots", "dashboard/places")}
        >
          <MenuIcon /> Meine Orte
        </MenuItem>

        <MenuItem
          active={activeSection === "leads"}
          onClick={() => goTo("leads", "dashboard/leads")}
        >
          <MenuIcon /> Leads & Analysen
        </MenuItem>

        <MenuItem
          active={activeSection === "subscription"}
          onClick={() => goTo("subscription", "dashboard/subscription")}
        >
          <MenuIcon /> Abonnement
        </MenuItem>

        <MenuItem
          active={activeSection === "profile"}
          onClick={() => goTo("profile", "dashboard/profile")}
        >
          <MenuIcon /> Profileinstellungen
        </MenuItem>

        {/* {userType === "2" && (
          <MenuItem
            active={activeSection === "users"}
            onClick={() => goTo("users", "dashboard/users")}
          >
            <MenuIcon /> Nutzer
          </MenuItem>
        )} */}

        <MenuItem onClick={handleLogout}>
          <MenuIcon /> Abmelden
        </MenuItem>
      </SidebarMenuWrapper>
    </Sidebar>
  );
};

export default SidebarMenu;
