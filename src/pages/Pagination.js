import React from "react";
import styled from "styled-components";
import "../css/theme.css"; // ✅ Theme import

// ==================== THEME-BASED STYLES ====================
export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-top: 5rem;
  font-family: var(--font-base);
`;

export const PageButton = styled.button`
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 3px 6px var(--color-shadow);

  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #e0e0e0;
    color: #9e9e9e;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const PageInfo = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-main);
`;

// ==================== COMPONENT ====================
export default function Pagination({ currentPage, lastPage, onPageChange }) {
  return (
    <PaginationWrapper>
      <PageButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀ Vorherige
      </PageButton>

      <PageInfo>
        Seite {currentPage} von {lastPage}
      </PageInfo>

      <PageButton
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Nächste ▶
      </PageButton>
    </PaginationWrapper>
  );
}
