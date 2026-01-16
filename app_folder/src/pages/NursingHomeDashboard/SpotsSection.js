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
import { useTranslation } from 'react-i18next';

// ====== Styled Components ======
const DataTable = styled.div`
  border-radius: 12px;
  overflow: hidden;
  width: 95%;
  max-width: 1100px;
  margin: 1.5rem auto;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background: var(--color-primary);
  color: #fff;
  padding: 1rem 1.5rem;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

// const TableTitle = styled.h2`
//   font-size: 1.1rem;
//   font-weight: 600;
//   margin: 0;
// `;

const AddButton = styled.button`
  background: #28637E;
  color: var(--color-surface-alt);
  border: 1px solid var(--color-primary);
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.25s ease;
  float: right;

  &:hover {
    background: var(--color-primary);
    color: #fff;
  }
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
const SpotsSection = ({ showEditPage }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [spots, setSpots] = useState([]);
  const [showAddPage, setShowAddPage] = useState(false);
  const [spotToEdit, setSpotToEdit] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [planStatus, setPlanStatus] = useState("");   // active | expired | free | trialing
  const [currentPlan, setCurrentPlan] = useState(""); // basic | pro | enterprise | free
  const [loadingPlan, setLoadingPlan] = useState(true);
  const isAddDisabled = planStatus === "expired" || planStatus === "cancelled";
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage] = useState(10);
  const token = localStorage.getItem("pflegeUserToken");
  const pflegeUserId = localStorage.getItem("pflegeUserId");
  const type = localStorage.getItem("pflegeUsertype");

  useEffect(() => {
    fetchSpots(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (showEditPage && id && spots.length > 0) {
      const spot = spots.find((s) => s.id === parseInt(id));
      if (spot) setSpotToEdit(spot);
      setShowAddPage(true);
    }
  }, [showEditPage, id, spots]);

  useEffect(() => {
    const fetchPlanInfo = async () => {
      try {
        const token = localStorage.getItem("pflegeUserToken");
        if (!token) return;

        const res = await axios.get(`${BaseUrl}user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.data; // assuming API returns user data here
        setCurrentPlan(user.current_plan.toLowerCase());
        setPlanStatus(user.plan_status.toLowerCase());
      } catch (err) {
        console.error("Failed to fetch plan info", err);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlanInfo();
  }, []);

  const fetchSpots = async (page = 1) => {
    try {
      const res = await axios.get(`${BaseUrl}spots`, {
        params: {
          user_id: pflegeUserId,
          usertype: type,
          page: page,
          per_page: perPage,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSpots(res.data.data.data);       // actual records
      setCurrentPage(res.data.data.current_page);
      setLastPage(res.data.data.last_page);
    } catch (err) {
      console.error("Fetch spots error:", err);
    }
  };


  const handleDeleteSpot = (id) => {
    confirmAlert({
      title: t("spots.confirm_delete_title"),
      message: t("spots.confirm_delete_message"),
      buttons: [
        {
          label: t("spots.buttons.yes"),
          onClick: async () => {
            try {
              await axios.delete(`${BaseUrl}deletespot/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchSpots();
            } catch (err) {
              confirmAlert({
                title: t("spots.delete_error_title"),
                message: t("spots.delete_error_message"),
                buttons: [{ label: t("spots.buttons.ok"), onClick: () => { } }]
              });
            }
          }
        },
        {
          label: t("spots.buttons.no"),
          onClick: () => { }
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
        {/* <TableHeader> */}
          <AddButton
            onClick={() => !isAddDisabled && navigate("/dashboard/places/new")}
            disabled={isAddDisabled || loadingPlan}
            style={{
              cursor: isAddDisabled ? "not-allowed" : "pointer",
              opacity: isAddDisabled ? 0.6 : 1
            }}
          >
            {loadingPlan
              ? t("spots.loading...")
              : isAddDisabled
                ? t("spots.upgrade_plan")
                : t("spots.add_new")}
          </AddButton>
          {/* <TableTitle>{t("spots.title")}</TableTitle> */}

        {/* </TableHeader> */}

        <TableContainer>
          <Table> 
            <TableHead>
              <tr>
                <TableHeaderCell>{t("spots.title")}</TableHeaderCell>
                {/* <TableHeaderCell>{t("spots.table.room_type")}</TableHeaderCell> */}
                <TableHeaderCell>{t("spots.table.care_type")}</TableHeaderCell>
                <TableHeaderCell>{t("spots.table.price_per_month")}</TableHeaderCell>
                {/* <TableHeaderCell>{t("spots.table.availability")}</TableHeaderCell> */}
                <TableHeaderCell>{t("spots.table.status")}</TableHeaderCell>
                {/* <TableHeaderCell>{t("spots.table.plan")}</TableHeaderCell> */}
                <TableHeaderCell>{t("spots.table.actions")}</TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => (
                  <TableRow key={spot.id}>
                    <TableCell>{spot.name_of_the_place}</TableCell>
                    {/* <TableCell>
                      {spot.room_type === "1" ? t("spots.room_types.1") : t("spots.room_types.2")}
                    </TableCell> */}
                    <TableCell>
                      {spot.care_level == "1"
                        ? t("spots.care_options.1")
                        : spot.care_level == "2"
                          ? t("spots.care_options.2")
                          : spot.care_level == "3"
                            ? t("spots.care_options.3")
                          : spot.care_level == "4"
                            ? t("spots.care_options.4")
                            : "-"}
                    </TableCell>
                    <TableCell>€{spot.price_per_month}</TableCell>
                    {/* <TableCell>
                      {spot.availability == "1"
                        ? t("spots.availability_options.1")
                        : spot.availability == "2"
                          ? t("spots.availability_options.2")
                          : spot.availability == "3"
                            ? t("spots.availability_options.3")
                            : "-"}
                    </TableCell> */}
                  <TableCell>
                    {spot.status === "active" ? (
                      <button style={{ backgroundColor: "green", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px" }}>
                        {t("spots.status_options.active")}
                      </button>
                    ) : spot.status === "inactive" || spot.status === "draft" ? (
                      <button style={{ backgroundColor: "red", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px" }}>
                        {t(`spots.status_options.${spot.status}`)}
                      </button>
                    ) : (
                      <button style={{ backgroundColor: "#ccc", color: "#000", border: "none", borderRadius: "4px", padding: "4px 10px" }}>
                        -
                      </button>
                    )}
                  </TableCell>
                    {/* <TableCell>
                      {spot.plan_level_cached === "free"
                        ? t("spots.plan_options.free")
                        : spot.plan_level_cached === "basic"
                          ? t("spots.plan_options.basic")
                          : spot.plan_level_cached === "pro"
                            ? t("spots.plan_options.pro")
                            : spot.plan_level_cached === "enterprise"
                              ? t("spots.plan_options.enterprise")
                              : "-"}
                    </TableCell> */}
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
                    {t("spots.no_spots")}
                    <br />
                    <AddButton onClick={() => navigate("/dashboard/places/new")}>
                      {t("spots.add_new")}
                    </AddButton>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DataTable>
      {lastPage > 1 && (
        <Pagination>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {t("spots.previous")}
          </PageButton>

          {[...Array(lastPage)].map((_, index) => {
            const page = index + 1;
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
            {t("spots.next")}
          </PageButton>
        </Pagination>
      )}


    </MainContent>
  );
};

export default SpotsSection;
