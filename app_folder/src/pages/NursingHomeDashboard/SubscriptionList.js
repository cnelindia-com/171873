import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import "../../css/theme.css";
import { BaseUrl } from "../../BaseUrl";
import { AddButton, MainContent } from "./StyledComponents";
import { useTranslation } from "react-i18next";
import { FiChevronRight } from "react-icons/fi";

/* ================= Styled Components ================= */



const DataTable = styled.div`
  border-radius: 12px;
  overflow: hidden;
  width: 95%;
  max-width: 1100px;
  margin: 1.5rem auto;
`;

const TableContainer = styled.div`
  box-shadow: 0 2px 10px var(--color-shadow);
  width: 100%;
  background: var(--color-surface);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: var(--color-background);
`;

const TableHeaderCell = styled.th`
  padding: 0.9rem 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--color-shadow);
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
  font-size: 0.95rem;
  border-bottom: 1px solid #eee;
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

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
`;

const Drawer = styled.div`
  position: fixed;
  right: 0;
  top: 73px;
  height: 100vh;
  width: 400px;
  background: #fff;
  padding: 24px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
`;

/* ================= Component ================= */

const SubscriptionsSection = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem("pflegeUserToken");

  const [subscriptions, setSubscriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchSubscriptions(currentPage);
  }, [currentPage]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchSubscriptions = async (page) => {
    try {
      const res = await axios.get(`${BaseUrl}subscriptions`, {
        params: { page },
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔒 Admin exclude (agar backend se role aa raha ho)
      // const filtered = res.data.data.data.filter(u => u.role !== "admin");

      setSubscriptions(res.data.data.data);
      setLastPage(res.data.data.last_page);
    } catch (err) {
      console.error("Subscription fetch error", err);
    }
  };

  return (
    <MainContent>
      <DataTable>
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>
                  {t("subscription_list.table.start_date")}
                </TableHeaderCell>
                <TableHeaderCell>
                  {t("subscription_list.table.facility_name")}
                </TableHeaderCell>
                <TableHeaderCell>
                  {t("subscription_list.table.user_name")}
                </TableHeaderCell>
                <TableHeaderCell style={{ width: "40px" }} />
              </tr>
            </TableHead>

            <tbody>
              {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{formatDate(sub.created_at)}</TableCell>
                    <TableCell>{sub.facility_name}</TableCell>
                    <TableCell>{sub.name}</TableCell>
                    <TableCell>
                      <FiChevronRight
                        style={{
                          cursor: "pointer",
                          color: "#1565c0",
                        }}
                        onClick={() => setSelectedUser(sub)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="4" style={{ textAlign: "center" }}>
                    {t("subscription_list.table.no_data")}
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </DataTable>

      {/* ================= Drawer ================= */}
      {selectedUser && (
        <DrawerOverlay onClick={() => setSelectedUser(null)}>
          <Drawer onClick={(e) => e.stopPropagation()}>
            <h3>{t("subscription_list.table.user_details")}</h3>

            <p>
              <b>{t("subscription_list.table.user_name")}:</b>{" "}
              {selectedUser.name}
            </p>
            <p>
              <b>{t("subscription_list.table.facility_name")}:</b>{" "}
              {selectedUser.facility_name}
            </p>
            <p>
              <b>{t("subscription_list.table.plan")}:</b>{" "}
              {t(`subscription_list.current_plan.${selectedUser.current_plan}`, "—")}
            </p>
            <p>
              <b>{t("subscription_list.table.status")}:</b>{" "}
              {t(`subscription_list.plan_status.${selectedUser.plan_status}`, "—")}
            </p>
            <p>
              <b>{t("subscription_list.table.start_date")}:</b>{" "}
              {formatDate(selectedUser.created_at)}
            </p>
            {/* <p>
              <b>{t("subscription_list.table.end_date")}:</b>{" "}
              {formatDate(selectedUser.current_period_end)}
            </p> */}

            <AddButton onClick={() => setSelectedUser(null)}>
              {t("common.close")}
            </AddButton>
          </Drawer>
        </DrawerOverlay>
      )}

      {/* ================= Pagination ================= */}
      {lastPage > 1 && (
        <Pagination>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            {t("pagination.previous")}
          </PageButton>

          {[...Array(lastPage)].map((_, i) => (
            <PageButton
              key={i}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}

          <PageButton
            disabled={currentPage === lastPage}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            {t("pagination.next")}
          </PageButton>
        </Pagination>
      )}
    </MainContent>
  );
};

export default SubscriptionsSection;
