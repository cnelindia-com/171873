import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../BaseUrl";
import { useTranslation } from "react-i18next";
import {
  Container,
  Title,
  Form,
  SearchHeader,
  Subtitle,
  Row,
  Label,
  Input,
  Select,
  SearchBtn,
  ResultsGrid,
  Card,
  Name,
  Address,
  Detail,
  Details,
  ButtonContainer,
  DetailsBtn,
} from "./Styles";
import Pagination from "./Pagination";
import styled from "styled-components";

export const FeaturedBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: gold;
  color: #000;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  z-index: 2;
`;
export const TitleWrapper = styled.div`
  position: relative;
  display: inline-block;
  background: ${({ isEnterprise }) =>
    isEnterprise ? "linear-gradient(135deg, #FFD700, #FFC400)" : "transparent"};
  padding: ${({ isEnterprise }) => (isEnterprise ? "6px 10px" : "0")};
  border-radius: 8px;
`;

export const TitleBadge = styled.span`
  position: absolute;
  top: 3px;
  right: 10px;
  background: rgb(255, 255, 255);
  color: #FFD700;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
  text-transform: uppercase;
`;



export const PlanRibbon = styled.div`
  position: absolute;
  // top: -12px;
  top: -28px;
  left: -65px;
  width: 130px;
  padding: 8px 0;
  text-align: center;
  transform: rotate(-35deg);
  z-index: 3;

  background: ${({ plan }) =>
    plan === "enterprise"
      ? "linear-gradient(135deg, #FFD700, #FFC400)"
      : plan === "pro"
      ? "linear-gradient(135deg, #cfd9ff, #9aa8ff)"
      : "#e0e0e0"};

  color: #000;
  box-shadow: ${({ plan }) =>
    plan === "enterprise"
      ? "0 0 12px rgba(255,215,0,0.9)"
      : plan === "pro"
      ? "0 0 6px rgba(100,120,255,0.6)"
      : "0 2px 4px rgba(0,0,0,0.2)"};

  .title {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    line-height: 1.1;
  }

  .sub {
    font-size: 9px;
    font-weight: 500;
    opacity: 0.85;
    margin-top: 2px;
    padding: 0 4px;
  }
`;


export default function SearchPage() {
   const { t } = useTranslation();
  const navigate = useNavigate();

  const openDetail = (facility) => {
    navigate(`/details/${facility.id}`);
  };
  const [postalError, setPostalError] = useState("");
  const [results, setResults] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total_count: 0,
  });

  const defaultFilters = {
    postal_code: "",
    city: "",
    distance: "",
    care_level: "",
    room_type: "",
    availability: "",
    sort: "recommended", // ⭐ PREMIUM
    lat: null,
    lng: null,
  };

  const [filters, setFilters] = useState(defaultFilters);

  // ✅ Get user location (ONLY used for distance sort)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFilters((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));
      },
      () => {
        console.warn("Location permission denied");
      }
    );
  }, []);

  useEffect(() => {
    fetchSpots();
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${BaseUrl}cities`);
      setCityList(res.data.data);
    } catch (error) {
      console.log("City fetch error:", error);
    }
  };

  // 🟡 DEFAULT LISTING (NO SEARCH)
  const fetchSpots = async (page = 1) => {
    try {
      const res = await axios.get(`${BaseUrl}allspots?page=${page}`);
      const api = res.data?.data;

      setResults(api.data);
      setPagination({
        current_page: api.current_page,
        last_page: api.last_page,
        per_page: api.per_page,
        total_count: api.total,
      });
    } catch (error) {
      console.error("Error fetching spots:", error);
    }
  };

// const handleSearch = async (e, page = 1) => {
//   if (e) e.preventDefault();

//   // Only validate city/postal_code on form submit
//   if (e && !filters.city && !filters.postal_code) {
//     alert("Bitte Stadt oder PLZ eingeben");
//     return;
//   }

//   try {
//     const query = new URLSearchParams({ ...filters, page }).toString();
//     const response = await axios.get(`${BaseUrl}search?${query}`);

//    const api = response.data;
//     setResults(api.results);
//     setPagination({
//       current_page: api.current_page,
//       last_page: api.total_pages,
//       total_count: api.total_count,
//     });

//   } catch (error) {
//     console.log("Search error:", error);
//   }
// };

const handleSearch = async (e) => {
  if (e) e.preventDefault();

  if (!filters.city && !filters.postal_code) {
    alert("Bitte Stadt oder PLZ eingeben");
    return;
  }

  try {
    const query = new URLSearchParams({ ...filters, page: 1 }).toString();
    const response = await axios.get(`${BaseUrl}search?${query}`);

    const api = response.data;

    setResults(api.results);
    setPagination({
      current_page: api.current_page,
      last_page: api.total_pages,
      total_count: api.total_count, // ⭐ FULL TOTAL (13)
    });
  } catch (error) {
    console.log("Search error:", error);
  }
};

const handlePageChange = async (page) => {
  try {
    const query = new URLSearchParams({ ...filters, page }).toString();
    const response = await axios.get(`${BaseUrl}search?${query}`);

    const api = response.data;

    setResults(api.results);
    setPagination((prev) => ({
      ...prev,
      current_page: api.current_page,
      // ⛔ total_count ko touch hi nahi karna
    }));
  } catch (error) {
    console.log("Pagination error:", error);
  }
};

const handleSortChange = async (sortValue) => {
  const updatedFilters = {
    ...filters,
    sort: sortValue,
  };

  setFilters(updatedFilters);

  try {
    const query = new URLSearchParams({
      ...updatedFilters,
      page: 1,
    }).toString();

    const response = await axios.get(`${BaseUrl}search?${query}`);
    const api = response.data;

    setResults(api.results);
    setPagination({
      current_page: api.current_page,
      last_page: api.total_pages,
      total_count: api.total_count,
    });
  } catch (error) {
    console.log("Sort error:", error);
  }
};

const handleResetFilters = async () => {
  setFilters(defaultFilters); // Reset filters
  try {
    // Fetch the default listing
    const res = await axios.get(`${BaseUrl}allspots?page=1`);
    const api = res.data?.data;

    setResults(api.data);
    setPagination({
      current_page: api.current_page,
      last_page: api.last_page,
      per_page: api.per_page,
      total_count: api.total,
    });
  } catch (error) {
    console.error("Error resetting filters:", error);
  }
};


  return (
    <Container>
      <SearchHeader>
        <Title>{t("search.title")}</Title>
        <Subtitle>
          {t("search.subtitle")}
        </Subtitle>
      </SearchHeader>

      {/* ================= SEARCH FORM ================= */}
      <Form onSubmit={handleSearch}>
        <Row>
          <div>
            <Label>{t("search.form.postal_code")}</Label>
            {/* <Input
              placeholder={t("search.form.postal_placeholder")}
              value={filters.postal_code}
              onChange={(e) =>
                setFilters({ ...filters, postal_code: e.target.value })
              }
            /> */}
            {/* <Input
              placeholder={t("search.form.postal_placeholder")}
              value={filters.postal_code}
              onChange={async (e) => {
                const postal = e.target.value;

                setFilters((prev) => ({
                  ...prev,
                  postal_code: postal,
                }));

                // 🔥 Only when postal code length is enough
                if (postal.length >= 3) {
                  try {
                    const res = await axios.get(
                      `${BaseUrl}city-by-postal?postal_code=${postal}`
                    );

                    if (res.data.status && res.data.city) {
                      setFilters((prev) => ({
                        ...prev,
                        postal_code: postal,
                        city: res.data.city, // ⭐ AUTO SELECT CITY
                      }));
                    }
                  } catch (err) {
                    console.log("Postal city error:", err);
                  }
                }
              }}
            /> */}
            {/* <Input
              placeholder={t("search.form.postal_placeholder")}
              value={filters.postal_code}
              onChange={async (e) => {
                const postal = e.target.value;

                setPostalError(""); // reset error

                setFilters((prev) => ({
                  ...prev,
                  postal_code: postal,
                  city: "", // 🔥 reset city on change
                }));

                if (postal.length >= 3) {
                  try {
                    const res = await axios.get(
                      `${BaseUrl}city-by-postal?postal_code=${postal}`
                    );

                    if (res.data.status && res.data.city) {
                      setFilters((prev) => ({
                        ...prev,
                        postal_code: postal,
                        city: res.data.city, // ✅ city found
                      }));
                    } else {
                      // ❌ postal code not found
                    setPostalError(t("search.errors.postal_not_found"));
                    }
                  } catch (err) {
                  setPostalError(t("search.errors.postal_not_found"));
                  }
                }
              }}
            /> */}

            <Input
  placeholder={t("search.form.postal_placeholder")}
  value={filters.postal_code}
  inputMode="numeric"        // 📱 mobile numeric keyboard
  pattern="[0-9]*"           // 🔢 hint for numbers only
  onChange={async (e) => {
    // ❌ remove non-numeric characters
    const postal = e.target.value.replace(/\D/g, "");

    setPostalError("");

    setFilters((prev) => ({
      ...prev,
      postal_code: postal,
      city: "",
    }));

    if (postal.length >= 3) {
      try {
        const res = await axios.get(
          `${BaseUrl}city-by-postal?postal_code=${postal}`
        );

        if (res.data.status && res.data.city) {
          setFilters((prev) => ({
            ...prev,
            postal_code: postal,
            city: res.data.city,
          }));
        } else {
          setPostalError(t("search.errors.postal_not_found"));
        }
      } catch (err) {
        setPostalError(t("search.errors.postal_not_found"));
      }
    }
  }}
/>






          </div>

          <div>
            
            <Label>{t("search.form.city")}</Label>
            {/* <Select
              value={filters.city}
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value })
              }
            >
              <option value="">{t("search.form.all")}</option>
              {cityList.map((item, index) => (
                <option key={index} value={item.city}>
                  {item.city}
                </option>
              ))}
            </Select> */}
            <Select
              value={filters.city}
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value })
              }
            >
              <option value="">{t("search.form.please_select")}</option>
              {cityList.map((item, index) => (
                <option key={index} value={item.city}>
                  {item.city}
                </option>
              ))}
            </Select>

          </div>
        </Row>
{postalError && (
  <div
    style={{
      marginTop: "6px",
      marginBottom: "8px",
      padding: "8px 10px",
      backgroundColor: "#e9e9ed",
      color: "#0e0d0dbd",
      fontSize: "13px",
      borderRadius: "4px",
      // width: "100%",   // ✅ FIX
      fontWeight: "600",
    }}
  >
    {postalError}
  </div>
)}

        <Row>
          <div>
            <Label>{t("search.form.care_level")}</Label>
            <Select
              value={filters.care_level}
              onChange={(e) =>
                setFilters({ ...filters, care_level: e.target.value })
              }
            >
              <option value="">{t("search.form.please_select")}</option>
              <option value="1">{t("search.form.care_levels.1")}</option>
              <option value="2">{t("search.form.care_levels.2")}</option>
              <option value="3">{t("search.form.care_levels.3")}</option>
              <option value="4">{t("search.form.care_levels.4")}</option>
            </Select>
          </div>

          <div>
            <Label>{t("search.form.availability")}</Label>
            <Select
              value={filters.availability}
              onChange={(e) =>
                setFilters({ ...filters, availability: e.target.value })
              }
            >
              <option value="">{t("search.form.please_select")}</option>
              <option value="1">{t("search.form.availability_options.1")}</option>
              <option value="2">{t("search.form.availability_options.2")}</option>
              <option value="3">{t("search.form.availability_options.3")}</option>
            </Select>
          </div>
        </Row>

        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <SearchBtn type="submit">{t("search.form.search")}</SearchBtn>

            <SearchBtn
              type="button"
              style={{ background: "#ccc", color: "#000" }}
              onClick={handleResetFilters}
            >
              {t("search.form.reset")}
            </SearchBtn>
          </div>
        </div>




      </Form>

      {/* ================= RESULTS ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "1.5rem 0 4rem 0",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {pagination.total_count} {t("search.results.found")}
        </h2>

        <div style={{ minWidth: "220px" }}>
          <Select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="recommended">{t("search.sort.recommended")}</option>
            <option value="price_asc">{t("search.sort.price_asc")}</option>
            <option value="price_desc">{t("search.sort.price_desc")}</option>
            <option value="distance">{t("search.sort.distance")}</option>
            <option value="availability">{t("search.sort.availability")}</option>
          </Select>
        </div>
      </div>


      {results.length === 0 && (
        <Card>
          <h3>{t("search.results.no_results_title")}</h3>
          <p>{t("search.results.no_results_desc")}</p>
          <DetailsBtn onClick={() => setFilters(defaultFilters)}>
            {t("search.form.reset")}
          </DetailsBtn>
        </Card>
      )}

      <ResultsGrid>
        {results.map((f) => (
          <Card key={f.id}>
            {/* ⭐ PLAN RIBBON */}
            {/* {f.plan_level_cached &&
              t(`search.plans.${f.plan_level_cached.toLowerCase()}`) !==
                `search.plans.${f.plan_level_cached.toLowerCase()}` && (
                <PlanRibbon plan={f.plan_level_cached.toLowerCase()}>
                  <div className="title">
                    {t(`search.plans.${f.plan_level_cached.toLowerCase()}.title`)}
                  </div>
                  <div className="sub">
                    {t(`search.plans.${f.plan_level_cached.toLowerCase()}.sub`)}
                  </div>
                </PlanRibbon>

            )} */}
            {f.plan_level_cached &&
              f.plan_level_cached.toLowerCase() !== "free" && (
                <PlanRibbon plan={f.plan_level_cached.toLowerCase()}>
                  <div className="title">
                    {t(`search.plans.${f.plan_level_cached.toLowerCase()}.title`)}
                  </div>
                  <div className="sub">
                    {t(`search.plans.${f.plan_level_cached.toLowerCase()}.sub`)}
                  </div>
                </PlanRibbon>
            )}


            {/* ⭐ FEATURED BADGE */}
            {/* {f.is_featured === 1 && (
              <FeaturedBadge>{t("search.card.featured")}</FeaturedBadge>
            )} */}
            {/* {f.is_featured === 1 && (
              <FeaturedBadge>{t(`search.plans.${f.plan_level_cached.toLowerCase()}.title`)}</FeaturedBadge>
            )} */}
            {/* <Name>{f.name_of_the_place}</Name> */}
            <TitleWrapper isEnterprise={f.plan_level_cached?.toLowerCase() === "enterprise"}>
            {f.is_featured== "1" && (
              <TitleBadge>{t(`search.plans.${f.plan_level_cached.toLowerCase()}.title`)}</TitleBadge>
            )}
            <Name>{f.name_of_the_place}</Name>
          </TitleWrapper>

            <Address>{f.address}</Address>

            <Details>
              <Detail>
                <span>{t("search.card.care")}</span>
                <strong>
                  {f.care_level === "1"
                    ? t("search.form.care_levels.1")
                    : f.care_level === "2"
                    ? t("search.form.care_levels.2")
                    : f.care_level === "3"
                    ? t("search.form.care_levels.3")
                    : f.care_level === "4"
                    ? t("search.form.care_levels.4")
                    : "-"}
                </strong>
              </Detail>

              <Detail>
                <span>{t("search.card.room")}</span>
                <strong>
                  {f.room_type === "1"
                    ? t("search.form.room_types.1")
                    : f.room_type === "2"
                    ? t("search.form.room_types.2")
                    : "-"}
                </strong>
              </Detail>

              <Detail>
                <span>{t("search.card.availability")}</span>
                {f.availability === "1"
                  ? "Sofort"
                  : f.availability === "2"
                  ? "Bald"
                  : f.availability === "3"
                  ? "Auf Anfrage"
                  : "-"}
              </Detail>

              <Detail>
                <span>{t("search.card.price")}</span>
                <strong>{f.price_per_month} {t("search.card.price_per_month")} </strong>
              </Detail>
            </Details>

            <ButtonContainer>
              <DetailsBtn onClick={() => openDetail(f)}>
                {t("search.card.details")}
              </DetailsBtn>
            </ButtonContainer>
          </Card>
        ))}
      </ResultsGrid>

      {/* ⭐ PAGINATION WITH FILTERS */}
      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        onPageChange={handlePageChange}
      />

    </Container>
  );
}
