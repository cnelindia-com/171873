import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import "../../css/theme.css";
import { BaseUrl } from "../../BaseUrl";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  MainContent,
} from "./StyledComponents";
// ====== Styled Components ======
const DataTable = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 2px 10px var(--color-shadow);
  overflow: hidden;
  width: 90%;
  max-width: 900px;
  margin: 1.5rem auto;
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
  background: var(--color-primary);
  color: #fff;
`;

const TableHeaderCell = styled.th`
  padding: 0.9rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
`;

const TableBody = styled.tbody`
  background: var(--color-surface);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f9f9f9;
  }

  &:hover {
    background: rgba(21, 101, 192, 0.05); /* light primary hover */
  }
`;

const TableCell = styled.td`
  padding: 0.9rem 1rem;
  color: var(--color-text-main);
  font-size: 0.95rem;
  border-bottom: 1px solid #eee;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TableButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.2s ease;
  color: var(--color-text-main);

  &.delete {
    color: var(--color-error);
    &:hover {
      color: #b71c1c;
      transform: scale(1.1);
    }
  }

  &.edit {
    color: var(--color-primary);
    &:hover {
      color: var(--color-primary-dark);
      transform: scale(1.1);
    }
  }
`;

// ====== Component ======
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const token = localStorage.getItem("pflegeUserToken");

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BaseUrl}users`, {
        params: { user_type: 2 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data?.data?.data || []);
    } catch (err) {
      console.error("Users fetch error", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Delete User
  const handleDeleteUser = (id) => {
    setDeleteUserId(id);
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`${BaseUrl}deleteuser/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteUserId(null);
      fetchUsers();
    } catch (err) {
      alert("Fehler beim Löschen!");
    }
  };

  return (
    <>
    <MainContent>
      <DataTable>
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Aktion</TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <ActionButtons>
                        <TableButton
                          className="delete"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          🗑️
                        </TableButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" style={{ textAlign: "center" }}>
                    Keine Benutzer gefunden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DataTable>
      {deleteUserId && (
        <ConfirmDeleteModal
          confirmDelete={confirmDeleteUser}
          setDeleteConfirmId={setDeleteUserId}
        />
      )}
      </MainContent>
    </>
  );
};

export default AllUsers;
