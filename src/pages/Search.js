import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../BaseUrl";
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

export default function SearchPage() {
  const navigate = useNavigate();

  const openDetail = (facility) => {
    navigate(`/details/${facility.id}`);
  };

  const [results, setResults] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
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
      });
    } catch (error) {
      console.error("Error fetching spots:", error);
    }
  };

  // 🔍 PREMIUM SEARCH
  const handleSearch = async (e, page = 1) => {
    if (e) e.preventDefault();

    // ❗ City or PLZ mandatory
    if (!filters.city && !filters.postal_code) {
      alert("Bitte Stadt oder PLZ eingeben");
      return;
    }

    try {
      const query = new URLSearchParams({ ...filters, page }).toString();
      const response = await axios.get(`${BaseUrl}search?${query}`);

      const api = response.data.data;
      setResults(api.data);
      setPagination({
        current_page: api.current_page,
        last_page: api.last_page,
        per_page: api.per_page,
      });
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  return (
    <Container>
      <SearchHeader>
        <Title>Pflegeheim finden</Title>
        <Subtitle>
          Das passende Heim für Ihre Liebsten – schnell und einfach
        </Subtitle>
      </SearchHeader>

      {/* ================= SEARCH FORM ================= */}
      <Form onSubmit={handleSearch}>
        <Row>
          <div>
            <Label>PLZ</Label>
            <Input
              placeholder="z.B. 53111"
              value={filters.postal_code}
              onChange={(e) =>
                setFilters({ ...filters, postal_code: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Stadt</Label>
            <Select
              value={filters.city}
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value })
              }
            >
              <option value="">Alle</option>
              {cityList.map((item, index) => (
                <option key={index} value={item.city}>
                  {item.city}
                </option>
              ))}
            </Select>
          </div>

          {/* <div>
            <Label>Entfernung (km)</Label>
            <Input
              type="number"
              placeholder="30"
              value={filters.distance}
              onChange={(e) =>
                setFilters({ ...filters, distance: e.target.value })
              }
            />
          </div> */}
        </Row>

        <Row>
          <div>
            <Label>Pflegestufe</Label>
            <Select
              value={filters.care_level}
              onChange={(e) =>
                setFilters({ ...filters, care_level: e.target.value })
              }
            >
              <option value="">Alle</option>
              <option value="1">Stufe 1</option>
              <option value="2">Stufe 2</option>
              <option value="3">Stufe 3</option>
            </Select>
          </div>

          {/* <div>
            <Label>Zimmerart</Label>
            <Select
              value={filters.room_type}
              onChange={(e) =>
                setFilters({ ...filters, room_type: e.target.value })
              }
            >
              <option value="">Alle</option>
              <option value="1">Einzelzimmer</option>
              <option value="2">Doppelzimmer</option>
            </Select>
          </div> */}

          <div>
            <Label>Verfügbarkeit</Label>
            <Select
              value={filters.availability}
              onChange={(e) =>
                setFilters({ ...filters, availability: e.target.value })
              }
            >
              <option value="">Alle</option>
              <option value="1">Sofort</option>
              <option value="2">Kurzfristig</option>
              <option value="3">1–3 Monate</option>
            </Select>
          </div>
        </Row>

        {/* ⭐ PREMIUM SORT */}
        <Row>
          <div>
            <Label>Sortieren</Label>
            <Select
              value={filters.sort}
              onChange={(e) =>
                setFilters({ ...filters, sort: e.target.value })
              }
            >
              <option value="recommended">Empfohlen</option>
              <option value="price_asc">Preis: Günstig → Teuer</option>
              <option value="price_desc">Preis: Teuer → Günstig</option>
              <option value="distance">Entfernung</option>
              <option value="availability">Verfügbarkeit</option>
            </Select>
          </div>
        </Row>

        <SearchBtn type="submit">Suchen</SearchBtn>
      </Form>

      {/* ================= RESULTS ================= */}
      <h2 style={{ margin: "1.5rem 0" }}>
        {results.length} Einrichtungen gefunden
      </h2>

      {results.length === 0 && (
        <Card>
          <h3>Keine Ergebnisse gefunden</h3>
          <p>Try changing your filters or search a nearby city.</p>
          <DetailsBtn onClick={() => setFilters(defaultFilters)}>
            Filter zurücksetzen
          </DetailsBtn>
        </Card>
      )}

      <ResultsGrid>
        {results.map((f) => (
          <Card key={f.id}>
            {/* ⭐ FEATURED BADGE */}
            {f.is_featured === 1 && (
              <FeaturedBadge>Featured</FeaturedBadge>
            )}
            <Name>{f.name_of_the_place}</Name>
            <Address>{f.address}</Address>

            <Details>
              <Detail>
                <span>Pflege</span>
                <strong>
                  {f.care_level ? `Stufe ${f.care_level}` : "Keine Angabe"}
                </strong>
              </Detail>

              <Detail>
                <span>Zimmer</span>
                <strong>
                  {f.room_type === "1"
                    ? "Einzelzimmer"
                    : f.room_type === "2"
                    ? "Doppelzimmer"
                    : "-"}
                </strong>
              </Detail>

              <Detail>
                <span>Verfügbarkeit</span>
                {f.availability === "1"
                  ? "Sofort"
                  : f.availability === "2"
                  ? "Kurzfristig"
                  : f.availability === "3"
                  ? "1–3 Monate"
                  : "-"}
              </Detail>

              <Detail>
                <span>Preis</span>
                <strong>{f.price_per_month}</strong>
              </Detail>
            </Details>

            <ButtonContainer>
              <DetailsBtn onClick={() => openDetail(f)}>
                Details anzeigen
              </DetailsBtn>
            </ButtonContainer>
          </Card>
        ))}
      </ResultsGrid>

      {/* ⭐ PAGINATION WITH FILTERS */}
      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        onPageChange={(page) => handleSearch(null, page)}
      />
    </Container>
  );
}
