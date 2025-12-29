import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import "../../css/theme.css";
import { BaseUrl } from "../../BaseUrl";
import AddSpotPage from "./AddSpotPage";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import { MainContent } from "./StyledComponents";

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
  background: var(--color-primary);
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

const AddButton = styled.button`
  background: #fff;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: var(--color-primary);
    color: #fff;
  }
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

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TableButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.2s ease;

  &.edit {
    color: var(--color-primary);
    &:hover {
      color: var(--color-primary-dark);
      transform: scale(1.1);
    }
  }

  &.delete {
    color: var(--color-error);
    &:hover {
      color: #b71c1c;
      transform: scale(1.1);
    }
  }

  &.view {
    color: var(--color-accent);
    &:hover {
      color: var(--color-primary);
      transform: scale(1.1);
    }
  }
`;

// ====== Component ======
const SpotsSection = ({ showEditPage }) => {
  const { id } = useParams();
  const [spots, setSpots] = useState([]);
  const [showAddPage, setShowAddPage] = useState(false);
  const [spotToEdit, setSpotToEdit] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("pflegeUserToken");
  const pflegeUserId = localStorage.getItem("pflegeUserId");
  const type = localStorage.getItem("pflegeUsertype");

  useEffect(() => {
    fetchSpots();
  }, []);

  useEffect(() => {
    if (showEditPage && id && spots.length > 0) {
      const spot = spots.find((s) => s.id === parseInt(id));
      if (spot) setSpotToEdit(spot);
      setShowAddPage(true);
    }
  }, [showEditPage, id, spots]);

  const fetchSpots = async () => {
    try {
      const res = await axios.get(`${BaseUrl}spots`, {
        params: { user_id: pflegeUserId, usertype: type },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpots(res.data?.data || []);
    } catch (err) {
      console.error("Fetch spots error:", err);
    }
  };

  const handleDeleteSpot = (id) => {
    confirmAlert({
      title: 'Löschen bestätigen',
      message: 'Sind Sie sicher, dass Sie diesen Platz löschen möchten?',
      buttons: [
        {
          label: 'Ja',
          onClick: async () => {
            try {
              await axios.delete(`${BaseUrl}deletespot/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchSpots();
            } catch (err) {
              confirmAlert({
                title: 'Fehler',
                message: 'Platz konnte nicht gelöscht werden.',
                buttons: [{ label: 'OK', onClick: () => {} }]
              });
            }
          }
        },
        {
          label: 'Nein',
          onClick: () => {}
        }
      ],
      overlayClassName: "custom-confirm-overlay",
      className: "custom-confirm-box"
    });
  };

  const handleEditSpot = (spot) => {
    navigate(`/dashboard/places/${spot.id}/edit`);
  };

  const filteredSpots = useMemo(() => {
    if (!selectedUser) return spots;
    return spots.filter((s) => s.user_id == selectedUser);
  }, [spots, selectedUser]);

  if (showAddPage) {
    return (
      <AddSpotPage
      editData={spotToEdit}
      onBack={async () => {
        setShowAddPage(false);
        setSpotToEdit(null);
        await fetchSpots();   // 🔥 ONLY HERE
        navigate("/dashboard/places");
      }}
    />

    );
  }

  return (
    <MainContent>
      <DataTable>
        <TableHeader>
          <TableTitle>Meine Plätze</TableTitle>
          <AddButton onClick={() => navigate("/dashboard/places/new")}>
            + Neuer Platz
          </AddButton>
        </TableHeader>

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Platzname</TableHeaderCell>
                <TableHeaderCell>Zimmertyp</TableHeaderCell>
                <TableHeaderCell>Preis (€/Monat)</TableHeaderCell>
                <TableHeaderCell>Verfügbarkeit</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Plan</TableHeaderCell>
                <TableHeaderCell>Aktionen</TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => (
                  <TableRow key={spot.id}>
                    <TableCell>{spot.name_of_the_place}</TableCell>
                    <TableCell>
                      {spot.room_type === "1" ? "Einzelzimmer" : "Doppelzimmer"}
                    </TableCell>
                    <TableCell>€{spot.price_per_month}</TableCell>
                    <TableCell>
                      {spot.availability == "1"
                        ? "Sofort"
                        : spot.availability == "2"
                          ? "Bald"
                          : spot.availability == "3"
                            ? "anfrage"
                            : "-"}
                    </TableCell>
                    <TableCell>{spot.status === "active" ? "Aktiv" : spot.status === "inactive" ? "Inaktiv" : spot.status === "draft" ? "Entwurf" : "-"}</TableCell>
                    <TableCell>
                      {spot.plan_level_cached === "free"
                        ? "Frei"
                        : spot.plan_level_cached === "basic"
                        ? "Basic"
                        : spot.plan_level_cached === "pro"
                        ? "Pro"
                        : spot.plan_level_cached === "enterprise"
                        ? "Unternehmen"
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <TableButton className="edit" onClick={() => handleEditSpot(spot)}>
                          <FaEdit />
                        </TableButton>
                        <TableButton className="delete" onClick={() => handleDeleteSpot(spot.id)}>
                          <FaTrash />
                        </TableButton>
                        <TableButton
                          className="view"
                          onClick={() => {
                            const basePath = window.location.pathname.split("/dashboard")[0];
                            window.open(`${window.location.origin}${basePath}/details/${spot.id}`, "_blank");
                          }}
                        >
                          <FaEye />
                        </TableButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="7" style={{ textAlign: "center" }}>
                    Sie haben noch keine Plätze. Beginnen Sie damit, Ihren ersten verfügbaren Platz hinzuzufügen.
                    <br />
                    <AddButton onClick={() => navigate("/dashboard/places/new")}>
                      + Neuer Platz
                    </AddButton>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DataTable>
    </MainContent>
  );
};

export default SpotsSection;
