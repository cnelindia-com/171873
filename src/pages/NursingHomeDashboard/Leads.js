import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import "../../css/theme.css";
import { BaseUrl } from "../../BaseUrl";

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
  MainContent
} from "./StyledComponents";

const careTypeMap = {
  1: "Stufe 1",
  2: "Stufe 2",
  3: "Stufe 3"
};

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

// ====================== MAIN COMPONENT ======================
const LeadsPage = () => {
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [monthlyInquiries, setMonthlyInquiries] = useState(0);
  const [lastInquiryDate, setLastInquiryDate] = useState("-");
  const [recentInquiries, setRecentInquiries] = useState([]);
  const type = localStorage.getItem("pflegeUsertype");
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    const res = await axios.get(`${BaseUrl}leads`, {
      params: {
        user_id: localStorage.getItem("pflegeUserId"),
        usertype: type 
      }
    });

    setTotalInquiries(res.data.total || 0);
    setMonthlyInquiries(res.data.monthly || 0);
    setLastInquiryDate(res.data.last_inquiry_date || "-");
    setRecentInquiries(res.data.recent || []);
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
        <Title>Leads & Analysen</Title>

        {/* KPI CARDS */}
        <StatsContainer>
          <StatCard>
            <StatNumber>{totalInquiries}</StatNumber>
            <StatLabel>Gesamtzahl der Anfragen</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>{monthlyInquiries}</StatNumber>
            <StatLabel>Anfragen in diesem Monat</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>{lastInquiryDate}</StatNumber>
            <StatLabel>Letzte Anfrage</StatLabel>
          </StatCard>
        </StatsContainer>

        <Divider />

        {/* TABLE */}
        <DataTable>
          <TableHeader>
            <TableTitle>Letzte Anfragen</TableTitle>
          </TableHeader>

          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Datum</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Pflegeart</TableHeaderCell>
                  <TableHeaderCell>Nachricht</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </tr>
              </TableHead>

              <TableBody>
                {recentInquiries.length ? (
                  recentInquiries.map(inq => (
                    <TableRow key={inq.id}>
                      <TableCell>{inq.date}</TableCell>
                      <TableCell>{inq.contact_name}</TableCell>
                      <TableCell>{careTypeMap[inq.care_type]}</TableCell>
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
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </StatusSelect>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <EmptyMessage colSpan="5">
                      Keine Anfragen gefunden
                    </EmptyMessage>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DataTable>
      </SectionContainer>
    </MainContent>
  );
};

export default LeadsPage;
