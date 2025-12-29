import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const LanguageToggle = styled.div`
  display: flex;
  gap: 8px;
  font-size: 0.9rem;
  cursor: pointer;

  span {
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
  }

  .active {
    background-color: #34495e;
    font-weight: bold;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #34495e;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: white;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #c0392b;
  }
`;

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('pflegeLoggedIn');
  const userName = localStorage.getItem('pflegeUserName');

  // 🔵 LANGUAGE STATE
  const [language, setLanguage] = useState('DE');

  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'DE';
    setLanguage(lang);
  }, []);

  const changeLanguage = (lang) => {
    localStorage.setItem('lang', lang);
    setLanguage(lang);
    window.location.reload(); // refresh UI for language change
  };

  const handleLogout = () => {
    localStorage.removeItem('pflegeLoggedIn');
    localStorage.removeItem('pflegeUserEmail');
    localStorage.removeItem('pflegeUserName');
    localStorage.removeItem('pflegeUsers');
    localStorage.removeItem('pflegeUserToken');
    localStorage.removeItem('pflegeUserId');
    localStorage.removeItem('facilities');
    localStorage.removeItem('pflegeUsertype');
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">PflegeFinder</Logo>

        <NavLinks>


          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard">Armaturenbrett</NavLink>

              <UserInfo>
                <UserName>Hallo, {userName}</UserName>
                {/* 🌍 LANGUAGE SWITCH */}
                <LanguageToggle>
                  <span
                    className={language === 'DE' ? 'active' : ''}
                    onClick={() => changeLanguage('DE')}
                  >
                    DE
                  </span>
                  |
                  <span
                    className={language === 'EN' ? 'active' : ''}
                    onClick={() => changeLanguage('EN')}
                  >
                    EN
                  </span>
                </LanguageToggle>
                <LogoutButton onClick={handleLogout}>Abmelden</LogoutButton>
              </UserInfo>
            </>
          ) : (
            <NavLink to="/login" state={{ login: true }}>
              Einloggen
            </NavLink>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
