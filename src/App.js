import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
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

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/spots") ||
    location.pathname.startsWith("/users") ||
    location.pathname.startsWith("/leads") ||
    location.pathname.startsWith("/subscription");

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
                    ? "Mein Profil"
                    : activeSection === "dashboard"
                      ? "Überblick"
                      : activeSection === "spots"
                        ? "Meine Plätze"
                        : activeSection === "leads"
                          ? "Leads & Analysen"
                          : activeSection === "users"
                            ? "Meine Benutzer"
                            : activeSection === "subscription"
                              ? "Abonnement"
                              : ""}
              </PageTitle>

              <UserInfo>
                <UserName>Willkommen zurück, {userName}</UserName>
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
              path="/dashboard/subscription"
              element={
                <SubscriptionPage />
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
    </AppContainer>
  );
}

export default App;
