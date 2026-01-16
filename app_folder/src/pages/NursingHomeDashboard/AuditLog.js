import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { BaseUrl } from "../../BaseUrl";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { MainContent } from "./StyledComponents";
import { useTranslation } from 'react-i18next';

// ====== Styled Components ======
const DataTable = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 2px 10px var(--color-shadow);
  overflow: hidden;
  width: 95%;
  max-width: 1100px;
  margin: 1.5rem auto;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-dark-background);
  color: #fff;
  padding: 1rem 1.5rem;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const TableTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-base);
`;

const TableHead = styled.thead`
  background: var(--color-background);
`;

const TableHeaderCell = styled.th`
  padding: 0.9rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-main);
  border-bottom: 2px solid var(--color-shadow);
`;

const TableBody = styled.tbody`
  background: var(--color-surface);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.03);
  }

  &:hover {
    background: rgba(21, 101, 192, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 0.8rem 1rem;
  color: var(--color-text-main);
  font-size: 0.95rem;
  border-bottom: 1px solid #eee;
`;

const TableButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1rem;
  color: var(--color-error);
  cursor: pointer;

  &:hover {
    color: #b71c1c;
    transform: scale(1.1);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 1rem;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-primary);
  background: ${({ active }) =>
    active ? "var(--color-primary)" : "#fff"};
  color: ${({ active }) => (active ? "#fff" : "var(--color-primary)")};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ====== Component ======
const AuditLog = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const fetchLogs = async (page = 1) => {
    try {
      const token = localStorage.getItem("pflegeUserToken");
      const res = await axios.get(`${BaseUrl}audit-logs`, {
        params: { page, per_page: perPage },
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error("Fetch audit logs error:", err);
    }
  };

  const handleDeleteLog = (id) => {
    confirmAlert({
      title: t('audit.confirm.title'),
      message: t('audit.confirm.message'),
      buttons: [
        {
          label: t('audit.buttons.yes'),
          onClick: async () => {
            try {
              const token = localStorage.getItem("pflegeUserToken");
              await axios.delete(`${BaseUrl}audit-logs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchLogs(currentPage); // refresh after delete
            } catch (err) {
              confirmAlert({
                title: t('audit.errors.title'),
                message: t('audit.errors.delete_failed'),
                buttons: [{ label: t('audit.buttons.ok'), onClick: () => {} }]
              });
            }
          }
        },
        { label: t('audit.buttons.no'), onClick: () => {} }
      ]
    });
  };

  return (
    <MainContent>
      <DataTable>
        <TableHeader>
          <TableTitle>{t('audit.title')}</TableTitle>
        </TableHeader>

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>#</TableHeaderCell>
                <TableHeaderCell>{t('audit.table.user')}</TableHeaderCell>
                <TableHeaderCell>{t('audit.table.action')}</TableHeaderCell>
                {/* <TableHeaderCell>Referenz</TableHeaderCell> */}
                <TableHeaderCell>{t('audit.table.meta')}</TableHeaderCell>
                <TableHeaderCell>{t('audit.table.created_at')}</TableHeaderCell>
                <TableHeaderCell>{t('audit.table.actions')}</TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {(currentPage - 1) * perPage + index + 1}
                    </TableCell>
                    <TableCell>{log.user?.name ?? "-"}</TableCell>
                    <TableCell>{log.action_type}</TableCell>
                    {/* <TableCell>{log.reference_id}</TableCell> */}
                    <TableCell>{log.meta ? JSON.stringify(log.meta) : "-"}</TableCell>
                    <TableCell>
                    {new Date(log.created_at).toLocaleString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </TableCell>
                    <TableCell>
                      <TableButton onClick={() => handleDeleteLog(log.id)}>{t('audit.buttons.delete')}</TableButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="7" style={{ textAlign: "center" }}>
                    {t('audit.table.empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {lastPage > 1 && (
          <Pagination>
            <PageButton disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>{t('audit.buttons.prev')}</PageButton>
            {[...Array(lastPage)].map((_, index) => (
              <PageButton key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </PageButton>
            ))}
            <PageButton disabled={currentPage === lastPage} onClick={() => setCurrentPage(currentPage + 1)}>{t('audit.buttons.next')}</PageButton>
          </Pagination>
        )}
      </DataTable>
    </MainContent>
  );
};

export default AuditLog;
