import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "../../css/theme.css"; // ✅ Import theme root file

// ====== Styled Components ======
const ConfirmModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.3s ease forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ConfirmModalContent = styled.div`
  background: var(--color-surface);
  color: var(--color-text-main);
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px var(--color-shadow);
  max-width: 400px;
  width: 90%;
  text-align: center;
  font-family: var(--font-base);
  animation: scaleIn 0.25s ease forwards;

  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0.6;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const ConfirmModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text-main);
`;

const ConfirmModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ConfirmButton = styled.button`
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  transition: all 0.25s ease;

  &.yes {
    background: var(--color-error); /* 👈 red theme color */
    color: #fff;
  }

  &.yes:hover {
    background: #b71c1c;
  }

  &.no {
    background: var(--color-background);
    color: var(--color-text-main);
    border: 1px solid var(--color-shadow);
  }

  &.no:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

// ====== Component ======
const ConfirmDeleteModal = ({ confirmDelete, setDeleteConfirmId }) => {
  const [visible, setVisible] = useState(true);

  // Fade-out animation before removal
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setDeleteConfirmId(null), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <ConfirmModalOverlay onClick={() => setVisible(false)}>
      <ConfirmModalContent onClick={(e) => e.stopPropagation()}>
        <ConfirmModalTitle>Bist du sicher?</ConfirmModalTitle>
        <p>Möchten Sie diesen Platz wirklich löschen?</p>
        <ConfirmModalButtons>
          <ConfirmButton className="yes" onClick={confirmDelete}>
            JA
          </ConfirmButton>
          <ConfirmButton className="no" onClick={() => setVisible(false)}>
            NEIN
          </ConfirmButton>
        </ConfirmModalButtons>
      </ConfirmModalContent>
    </ConfirmModalOverlay>
  );
};

export default ConfirmDeleteModal;
