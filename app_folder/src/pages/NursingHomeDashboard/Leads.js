import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import "../../css/theme.css";
import { BaseUrl } from "../../BaseUrl";
import { useTranslation } from 'react-i18next';
import { FaUser, FaTrash, FaEye } from "react-icons/fa";


import {
  DataTable,
  TableHeader,
  TableTitle,
  TableContainer,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  StatsContainer,
  StatCard,
  StatNumber,
  StatLabel,
  MainContent,
  MenuIcon
} from "./StyledComponents";

const statusOptions = ["new", "draft", "active"];

// ====================== STYLED COMPONENTS ======================
const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
`;

const EmptyMessage = styled.td`
  text-align: center;
  padding: 1rem;
`;

const StatusSelect = styled.select`
  padding: 6px 10px;
  border-radius: 20px;
  border: 1px solid
    ${({ value }) =>
    value === "new"
      ? "#f0ad4e"
      : value === "active"
        ? "#28a745"
        : "#6c757d"};
  background-color:
    ${({ value }) =>
    value === "new"
      ? "#fff3cd"
      : value === "active"
        ? "#d4edda"
        : "#e2e3e5"};
  color:
    ${({ value }) =>
    value === "new"
      ? "#856404"
      : value === "active"
        ? "#155724"
        : "#383d41"};
  font-weight: 600;
  cursor: pointer;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? "var(--color-primary)" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  cursor: pointer;
  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

// ====================== MAIN COMPONENT ======================
const LeadsPage = () => {
  const [lastInquiry, setLastInquiry] = useState(null);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [monthlyInquiries, setMonthlyInquiries] = useState(0);
  const [lastInquiryDate, setLastInquiryDate] = useState("-");
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const type = localStorage.getItem("pflegeUsertype");
  const { t } = useTranslation();
  useEffect(() => {
    if (!type) return;
    fetchDashboardData(currentPage);
  }, [currentPage, type]);

  const fetchDashboardData = async (page = 1) => {
    try {
      const res = await axios.get(`${BaseUrl}leads`, {
        params: {
          user_id: localStorage.getItem("pflegeUserId"),
          usertype: type,
          page: page,
          per_page: 20
        }
      });

      setTotalInquiries(res.data.total || 0);
      setMonthlyInquiries(res.data.monthly || 0);
      setLastInquiryDate(res.data.last_inquiry_date || "-");
      const last = res.data.last_inquiry || null; // expect backend to return full last inquiry object
      setLastInquiry(last);
      // ✅ FIX HERE
      setRecentInquiries(res.data.data || []);

      // pagination agar backend se aa rahi ho
      setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);

    } catch (error) {
      console.error(error);
    }
  };




  const updateLeadStatus = async (leadId, status) => {
    try {
      await axios.put(`${BaseUrl}leads/${leadId}/status`, {
        status
      });

      setRecentInquiries(prev =>
        prev.map(item =>
          item.id === leadId ? { ...item, status } : item
        )
      );
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  return (
    <MainContent>
      <SectionContainer>
        {/* <Title>{t("leads.title")}</Title> */}

        {/* KPI CARDS */}
        <StatsContainer>
          <StatCard>
            <StatNumber>{totalInquiries}</StatNumber>
            <StatLabel>{t("leads.kpi.total")}</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>{monthlyInquiries}</StatNumber>
            <StatLabel>{t("leads.kpi.monthly")}</StatLabel>
          </StatCard>

          {/* <StatCard>
            <StatNumber>{lastInquiryDate}</StatNumber>
            <StatLabel>{t("leads.kpi.last")}</StatLabel>
          </StatCard> */}
          <StatCard style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
  {/* Profile Icon */}
  <div style={{
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "#fff"
  }}>
    <span><FaUser/></span>
  </div>

  {/* Label above */}
  <StatLabel style={{ fontSize: "0.8rem", color: "#666" }}>
    {t("leads.kpi.last", { defaultValue: "LETZTE ANFRAGE" })}
  </StatLabel>

  {/* Name and email */}
  {lastInquiry ? (
    <>
      <StatNumber style={{ fontSize: "1rem", fontWeight: "600" }}>{lastInquiry.contact_name}</StatNumber>
      <StatLabel style={{ fontSize: "0.8rem" }}>{lastInquiry.contact_email}</StatLabel>
    </>
  ) : (
    <>
      <StatNumber>-</StatNumber>
      <StatLabel>{t("leads.kpi.last")}</StatLabel>
    </>
  )}
</StatCard>



        </StatsContainer>

        <Divider />

        {/* TABLE */}
        <DataTable>
          <TableHeader>
            <TableTitle>{t("leads.table.title")}</TableTitle>
          </TableHeader>

          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>{t("leads.table.date")}</TableHeaderCell>
                  <TableHeaderCell>{t("leads.table.name")}</TableHeaderCell>
                  <TableHeaderCell>{t("leads.table.email")}</TableHeaderCell>
                  <TableHeaderCell>{t("leads.table.care_type")}</TableHeaderCell>
                  <TableHeaderCell>{t("leads.table.message")}</TableHeaderCell>
                  <TableHeaderCell>{t("leads.table.status")}</TableHeaderCell>
                </tr>
              </TableHead>

              <TableBody>
                {recentInquiries.length ? (
                  recentInquiries.map(inq => (
                    <TableRow key={inq.id}>
                      <TableCell>{inq.date}</TableCell>
                      <TableCell>{inq.contact_name}</TableCell>
                      <TableCell>{inq.contact_email}</TableCell>
                      <TableCell>{t(`leads.care_types.${inq.care_type}`)}</TableCell>
                      <TableCell>
                        {inq.message?.slice(0, 60)}
                        {inq.message?.length > 60 && "..."}
                      </TableCell>
                      <TableCell>
                        <StatusSelect
                          value={inq.status}
                          onChange={(e) =>
                            updateLeadStatus(inq.id, e.target.value)
                          }
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>
                              {t(`leads.status_options.${status}`, {
                                defaultValue: status.toUpperCase()
                              })}
                            </option>
                          ))}
                        </StatusSelect>

                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <EmptyMessage colSpan="5">
                      {t("leads.table.no_inquiries")}
                    </EmptyMessage>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DataTable>
        {lastPage > 1 && (
          <PaginationContainer>
            <PageButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {t("leads.pagination.previous")}
            </PageButton>

            {[...Array(lastPage)].map((_, i) => {
              const page = i + 1;
              return (
                <PageButton
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              );
            })}

            <PageButton
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {t("leads.pagination.next")}
            </PageButton>
          </PaginationContainer>
        )}
      </SectionContainer>
    </MainContent>
  );
};

export default LeadsPage;
