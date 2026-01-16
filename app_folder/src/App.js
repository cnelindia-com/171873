import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import LoginRegister from './pages/LoginRegister';
import NursingHomeDashboard from './pages/NursingHomeDashboard/NursingHomeDashboard'; // ✅ updated import path
import ProfileSection from './pages/NursingHomeDashboard/ProfileSection';
import SpotsSection from './pages/NursingHomeDashboard/SpotsSection';
import AllUsers from './pages/NursingHomeDashboard/AllUsers';
import SubscriptionPage from './pages/NursingHomeDashboard/SubscriptionPage';
import Leads from './pages/NursingHomeDashboard/Leads';
import SidebarMenu from './pages/NursingHomeDashboard/SidebarMenu';
import FacilityDetails from './pages/FacilityDetails';
import AddSpotPage from "./pages/NursingHomeDashboard/AddSpotPage";
import AuditLog from "./pages/NursingHomeDashboard/AuditLog";
import { LanguageProvider } from "./context/LanguageContext";
import { useTranslation } from 'react-i18next';
import TermsConditions from "./pages/NursingHomeDashboard/TermsConditons";
import PrivacyPolicy from "./pages/NursingHomeDashboard/PrivacyPolicy";
import SubscriptionList from "./pages/NursingHomeDashboard/SubscriptionList";

// ✅ (No other new imports needed since all sub-pages are internal to NursingHomeDashboard)
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

import {
  Container,
  PageHeader,
  PageTitle,
  UserInfo,
  UserName,
  MainContent
} from "./pages/NursingHomeDashboard/StyledComponents";
import { Price } from "./pages/FacilityDetails/DetailsStyles";

function App() {
  const { t } = useTranslation();


  const navigate = useNavigate();
  const location = useLocation();
  // const isDashboardRoute =
  //   location.pathname.startsWith("/dashboard") ||
  //   location.pathname.startsWith("/profile") ||
  //   location.pathname.startsWith("/spots") ||
  //   location.pathname.startsWith("/users") ||
  //   location.pathname.startsWith("/leads") ||
  //   location.pathname.startsWith("/subscription") ||
  //   location.pathname.startsWith("/activity-logs");
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  useEffect(() => {
  if (location.pathname.startsWith("/dashboard/profile")) {
    setActiveSection("profile");
  } else if (location.pathname.startsWith("/dashboard/places")) {
    setActiveSection("spots");
  } else if (location.pathname.startsWith("/dashboard/users")) {
    setActiveSection("users");
  } else if (location.pathname.startsWith("/dashboard/leads")) {
    setActiveSection("leads");
  } else if (location.pathname.startsWith("/dashboard/subscription")) {
    setActiveSection("subscription");
  } else if (location.pathname.startsWith("/dashboard/activity-logs")) {
    setActiveSection("activity-logs");
  } else if (location.pathname === "/dashboard") {
    setActiveSection("dashboard");
  }
}, [location.pathname]);


  const [showAddPage, setShowAddPage] = useState(false);
  const userName = localStorage.getItem("pflegeUserName");
  const [activeSection, setActiveSection] = useState("dashboard");
  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  // Initialize demo data
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('pflegeUsers') || '[]');
    if (users.length === 0) {
      const demoUsers = [
        {
          id: 1,
          email: 'demo@pflegeheim.de',
          password: 'demo123',
          name: 'Demo Pflegeheim',
          phone: '0251 123456',
          address: 'Demo Straße 123, 48155 Münster',
          userType: 'nursing_home',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          email: 'family@demo.de',
          password: 'demo123',
          name: 'Demo Familie',
          phone: '0251 654321',
          address: 'Demo Family Straße 45, 48165 Münster',
          userType: 'family',
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('pflegeUsers', JSON.stringify(demoUsers));
    }

    const facilities = JSON.parse(localStorage.getItem('facilities') || '[]');
    if (facilities.length === 0) {
      const mockFacilities = [
        {
          id: 1,
          name: 'Seniorenzentrum Münsterland',
          address: 'Musterstraße 123, 48155 Münster',
          postalCode: '48155',
          city: 'Münster',
          careLevel: 'Pflegestufe 2-3',
          roomType: 'Einzelzimmer',
          availability: 'sofort',
          price: '€2.800/Monat',
          phone: '0251 123456',
          email: 'info@seniorenzentrum-muenster.de',
          description: 'Modernes Seniorenzentrum mit 120 Plätzen'
        },
        {
          id: 2,
          name: 'Altenpflegeheim St. Josef',
          address: 'Hauptstraße 45, 48165 Münster',
          postalCode: '48165',
          city: 'Münster',
          careLevel: 'Pflegestufe 1-4',
          roomType: 'Doppelzimmer',
          availability: 'kurzfristig',
          price: '€2.200/Monat',
          phone: '0251 654321',
          email: 'info@st-josef.de',
          description: 'Traditionsreiches Pflegeheim mit familiärer Atmosphäre'
        }
      ];
      localStorage.setItem('facilities', JSON.stringify(mockFacilities));
    }
  }, []);

  return (
    <LanguageProvider>
    <AppContainer>
      <Header />
      {isDashboardRoute && (
        <SidebarMenu
          userName={userName}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleLogout={handleLogout}
        />
      )}
      <Container hasSidebar={isDashboardRoute}>
        <MainContent hasSidebar={isDashboardRoute}>
          {isDashboardRoute && (
            <PageHeader>
              <PageTitle>
                {showAddPage
                  ? "Neuen Spot hinzufügen"
                  : activeSection === "profile"
                    ? t("sidebar.menu.profile")
                    : activeSection === "dashboard"
                      ? t("sidebar.menu.dashboard")
                      : activeSection === "spots"
                        ? t("sidebar.menu.places")
                        : activeSection === "leads"
                          ? t("sidebar.menu.leads")
                        : activeSection === "activity-logs"
                          ? t("sidebar.menu.activity_logs")
                          : activeSection === "users"
                            ? t("sidebar.menu.users")
                            : activeSection === "subscription"
                              ? t("sidebar.menu.subscription")
                              : ""}
              </PageTitle>

              <UserInfo>
                <UserName>{t("auth.login_title")} {userName}</UserName>
              </UserInfo>
            </PageHeader>
              )}
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/suche" element={<Search />} />
                <Route path="/details/:id" element={<FacilityDetails />} />
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/register" element={<LoginRegister />} />  
                <Route path="/terms" element={<TermsConditions />} />  
                <Route path="/privacy" element={<PrivacyPolicy />} />  

                {/* Protected Routes */}
                <Route
                  path="/dashboard/profile"
                  element={
                    <ProfileSection />
                  }
                />
                <Route
                  path="/dashboard/places"
                  element={
                    <SpotsSection />
                  }
                />
                <Route
                  path="/dashboard/users"
                  element={
                    <AllUsers />
                  }
                />
                <Route
                  path="/dashboard/leads"
                  element={
                    <Leads />
                  }
                />
                <Route
                  path="/dashboard/activity-logs"
                  element={
                    <AuditLog />
                  }
                />
                <Route
                  path="/dashboard/subscription"
                  element={
                    <SubscriptionPage />
                  }
                />
                <Route
                  path="/dashboard/subscription_list"
                  element={
                    <SubscriptionList />
                  }
                />

                {/* ✅ Dashboard route (imports from folder structure) */}
                <Route
                  path="/dashboard"
                  element={
                    // <ProtectedRoute allowedTypes={['nursing_home']}>
                    <NursingHomeDashboard />
                    // </ProtectedRoute>
                  }
                />
                <Route
                path="/dashboard/places/:id/edit"
                element={<SpotsSection showEditPage={true} />}
              />
                <Route
                path="/dashboard/places/new"
                element={<AddSpotPage onBack={() => navigate("/dashboard/places")} />}
              />
                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
        </MainContent>
          </Container>
          {/* {isDashboardRoute && ( */}
          <Footer />
         {/* )} */}
    </AppContainer>
    </LanguageProvider>
  );
}

export default App;
