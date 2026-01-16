// src/pages/NursingHomeDashboard/StyledComponents.js
import styled, { keyframes } from "styled-components";

/* =========================
   Animations
========================= */
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

/* =========================
   Layout
========================= */
export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ hasSidebar }) =>
    hasSidebar
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "transparent"};
`;


export const Sidebar = styled.div`
  width: 240px;
  background-color: var(--color-sidebar-background); /* solid dark navy */
  backdrop-filter: blur(10px);
  padding: 1.5rem 0;
  margin:3rem 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  animation: ${slideIn} 0.5s ease-out;
`;

export const SidebarHeader = styled.div`
  text-align: center;
  // padding: 1.5rem 1rem 1.5rem; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 13px 0.8rem;
`;

export const SidebarTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
`;

export const SidebarSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
`;

export const SidebarMenu = styled.div`
  padding: 1rem 0.8rem;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 0.4rem;
  background: ${(props) => (props.active ? "#28637E" : "transparent")};
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  &:hover::before { left: 100%; }
  &:hover {
    background:#28637E;
    transform: translateX(3px);
  }
`;

export const MenuIcon = styled.span`
  font-size: 1.1rem;
  width: fit-content;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

export const MainContent = styled.div`
  flex: 1;
  margin-left: ${({ hasSidebar }) => (hasSidebar ? "240px" : "0")};
  padding: 1.5rem;
  background: ${({ hasSidebar }) =>
    hasSidebar ? "rgba(255, 255, 255, 0.95)" : "transparent"};
  border-radius: ${({ hasSidebar }) =>
    hasSidebar ? "25px 0 0 25px" : "0"};
  box-shadow: ${({ hasSidebar }) =>
    hasSidebar ? "-10px 0 30px rgba(0, 0, 0, 0.1)" : "none"};
`;


export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

export const PageTitle = styled.h1`
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export const UserName = styled.span`
  color: #2c3e50;
  font-weight: 500;
  font-size: 1rem;
`;

/* =========================
   Profile
========================= */
export const ProfileCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.8s ease-out;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;

export const ProfileAvatar = styled.div`
  width: 80px; height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 2rem;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
`;

export const ProfileDetails = styled.div`
  flex: 1;
`;

export const ProfileName = styled.h2`
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
`;

export const ProfileEmail = styled.p`
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 0.2rem;
`;

export const ProfileType = styled.span`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  box-shadow: 0 3px 10px rgba(39, 174, 96, 0.2);
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const InfoCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 1.5rem;
  border-radius: 15px;
  border-left: 4px solid #3498db;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  &:hover { transform: translateY(-3px); }
`;

export const InfoLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.div`
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 500;
`;

/* =========================
   Stats
========================= */
export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 1.8rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

export const StatNumber = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  background: ${({ variant }) =>
    variant === "primary" ? "#28637E" : "#263449"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.3rem;
`;

export const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

/* =========================
   Spots Table
========================= */
export const DataTable = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--color-dark-background);
  color: white;
`;

export const TableTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
`;

export const AddButton = styled.button`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.25);
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(39, 174, 96, 0.35);
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

export const TableHeaderCell = styled.th`
  padding: 1rem 0.8rem;
  text-align: left;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #dee2e6;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  transition: all 0.3s ease;
  border-bottom: 1px solid #e9ecef;
  &:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    transform: scale(1.005);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  }
`;

export const TableCell = styled.td`
  padding: 1rem 0.8rem;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const TableButton = styled.button`
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex; align-items: center; justify-content: center;

  &.edit {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
  }
  &.delete {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: white;
  }
  &:hover { transform: translateY(-1px); }
`;

/* =========================
   Add Spot Page
========================= */
export const AddSpotContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
  max-width: 800px;
  margin: 0 auto;
`;

export const AddSpotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

export const AddSpotTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

export const BackButton = styled.button`
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(149, 165, 166, 0.3);
  }
`;

export const AddSpotForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 0.6rem;
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #d1d8e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #d1d8e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #d1d8e0;
  border-radius: 10px;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  background: white;
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const CoordinateGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const FormButton = styled.button`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex; align-items: center; justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.25);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(39, 174, 96, 0.35);
  }
`;

/* =========================
   Delete Confirm Modal
========================= */
export const ConfirmModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ConfirmModalContent = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%; max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease-out;
`;

export const ConfirmModalTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

export const ConfirmModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

export const ConfirmButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &.yes {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.25);
  }
  &.no {
    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
    color: white;
    box-shadow: 0 5px 15px rgba(149, 165, 166, 0.25);
  }
  &:hover { transform: translateY(-1px); }
`;
