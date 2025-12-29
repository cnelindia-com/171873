import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import { ImageUrl } from "../../BaseUrl";
import "../../css/theme.css"; // ✅ Theme import
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// ====== Styled Components ======
const AddSpotContainer = styled.div`
  background: var(--color-surface);
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px var(--color-shadow);
  width: 80%;
  max-width: 950px;
  margin: 1.5rem auto;
`;

const AddSpotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddSpotTitle = styled.h2`
  font-size: 1.25rem;
  color: var(--color-text-main);
  font-weight: 600;
`;

const BackButton = styled.button`
  background: var(--color-background);
  color: var(--color-text-main);
  border: 1px solid var(--color-shadow);
  padding: 7px 18px;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const AddSpotForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 1.5rem;
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-text-main);
`;

const Input = styled.input`
  padding: 0.55rem 0.7rem;
  border: 1.5px solid #d0d7e2;
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text-main);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.15);
  }
`;

const Select = styled.select`
  padding: 0.55rem 0.7rem;
  border: 1.5px solid #d0d7e2;
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text-main);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.15);
  }
`;

const TextArea = styled.textarea`
  grid-column: 1 / -1;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1.5px solid #d0d7e2;
  color: var(--color-text-main);
`;

const PhotosWrapper = styled.div`
  grid-column: 1 / -1;
  margin-top: 10px;
`;

const PhotoPreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const ImgPreview = styled.div`
  position: relative;
`;

const PreviewImage = styled.img`
  width: 95px;
  height: 95px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--color-shadow);
`;

const RemoveImgBtn = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  cursor: pointer;
`;

const Divider = styled.hr`
  margin: 1rem 0 1.5rem;
  border: none;
  border-top: 1px solid var(--color-shadow);
`;

const ButtonRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  background: var(--color-success);
  color: #fff;
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #27ae60;
  }
`;

const CancelButton = styled.button`
  background: var(--color-error);
  color: #fff;
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

// ✅ Properly define the component function here
const AddSpotPage = ({ editData, onBack }) => {
  const pflegeUserId = localStorage.getItem("pflegeUserId");
  const token = localStorage.getItem("pflegeUserToken");

  const initialFormState = {
    name_of_the_place: "",
    room_type: "",
    care_level: "",
    care_types: [],          // NEW: multiple care options
    availability: "",
    price_per_month: "",
    available_from: "",      // NEW: date
    available_spots: "",     // NEW: numeric
    priority_score: "",      // NEW: numeric
    plan_level_cached: "",   // NEW: select
    status: "",              // NEW: select
    description: "",
    address_street: "",
    postal_code: "",
    city: "",
    latitude: "",
    longitude: "",
    user_id: pflegeUserId,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [photos, setPhotos] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (editData) {
      setFormData({
        name_of_the_place: editData.name_of_the_place,
        room_type: editData.room_type,
        care_level: editData.care_level,
        availability: editData.availability,
        price_per_month: editData.price_per_month,
        available_spots: editData.available_spots,
        priority_score: editData.priority_score,
        plan_level_cached: editData.plan_level_cached,
        status: editData.status,
        description: editData.description,
        address_street: editData.address_street,
        city: editData.city,
        postal_code: editData.postal_code,
        latitude: editData.latitude,
        longitude: editData.longitude,
        user_id: pflegeUserId,
      });

      // // Normalize photos
      // const normalizedPhotos = (editData.images || []).map((img) => ({
      //   file: null,          // no file object for existing images
      //   url: img.url,        // URL from backend
      //   alt_text: img.alt_text || "",
      //   id: img.id,          // optional: keep backend ID for updates
      // }));

      // setPhotos(normalizedPhotos);
    }
  }, [editData]);

  useEffect(() => {
    if (!editData?.id) return;

    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `${BaseUrl}place-images/${editData.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const loadedPhotos = res.data.map((img) => ({
          id: img.id,
          file: null,
          url: `${ImageUrl}${img.file_url}`,
          alt_text: img.alt_text || "",
        }));

        setPhotos(loadedPhotos);
      } catch (err) {
        console.error("Failed to load images", err);
      }
    };

    fetchImages();
  }, [editData?.id]);





  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      alt_text: "", // initially empty
    }));
    setPhotos([...photos, ...files]);
  };


  const removePhoto = (index) => {
    const newPhotos = [...photos];
    if (newPhotos[index].id) {
      // Existing image → mark for deletion
      newPhotos[index].toDelete = true;
    } else {
      // New uploaded image → remove from array
      newPhotos.splice(index, 1);
    }
    setPhotos(newPhotos);
  };



  // ✅ RETURN always inside the component

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Bitte zuerst einloggen!");
      return;
    }

    try {
      let spotId = editData?.id;

      // 1️⃣ Create or update spot
      const spotFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        spotFormData.append(key, value);
      });

      if (editData) {
        spotFormData.append("_method", "PUT");
        await axios.post(`${BaseUrl}updatespot/${spotId}`, spotFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Pflegeplatz erfolgreich aktualisiert!");
      } else {
        const response = await axios.post(`${BaseUrl}addspot`, spotFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Correct path to the new spot ID
        spotId = response.data.data.id;
        toast.success("Pflegeplatz erfolgreich hinzugefügt!");
      }

      // 2️⃣ Upload images for this spot
      // if (photos.length > 0) {
      //   const imgFormData = new FormData();
      //   imgFormData.append("place_id", spotId);

      //   photos.forEach((img, idx) => {
      //     if (img.file) {
      //       imgFormData.append("photos[]", img.file);
      //       imgFormData.append(`alt_text[${idx}]`, img.alt_text); // send alt text
      //     }
      //   });

      //   await axios.post(`${BaseUrl}place-images`, imgFormData, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   });
      // }
      // 2️⃣ Upload images for this spot
      if (photos.length > 0) {
        const imgFormData = new FormData();
        imgFormData.append("place_id", spotId);

        const existingPhotos = [];
        const orderIndex = [];
        const altTexts = [];

        photos.forEach((img, idx) => {
          if (img.id) {
            // Existing image
            if (!img.toDelete) {
              existingPhotos.push(img.id);
              orderIndex.push(idx);          // optional, for ordering
              altTexts.push(img.alt_text);
            }
          } else if (img.file) {
            // New uploaded image
            imgFormData.append("photos[]", img.file);
            imgFormData.append(`alt_text[${idx}]`, img.alt_text);
            orderIndex.push(idx);
          }
        });

        // Send existing images info
        existingPhotos.forEach((id, i) => {
          imgFormData.append(`existing_photos[]`, id);
          imgFormData.append(`alt_text[${i}]`, altTexts[i] ?? '');
          imgFormData.append(`order_index[${i}]`, orderIndex[i]);
        });

        await axios.post(`${BaseUrl}place-images`, imgFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }



      onBack(); // Go back after save

    } catch (error) {
      console.error(error);
      toast.error("Fehler beim Speichern des Pflegeplatzes oder Bilder-Upload!");
    }
  };


  return (
    <AddSpotContainer>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <AddSpotHeader>
        <AddSpotTitle>
          {editData ? "Pflegeplatz bearbeiten" : "Neuen Pflegeplatz hinzufügen"}
        </AddSpotTitle>
        <BackButton onClick={onBack}>← Zurück</BackButton>

      </AddSpotHeader>

      <Divider />

      <AddSpotForm onSubmit={handleSubmit}>
        {/* BASIC FIELDS */}
        <FormGroup>
          <Label>Name des Pflegeplatzes *</Label>
          <Input
            name="name_of_the_place"
            value={formData.name_of_the_place}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Zimmertyp *</Label>
          <Select
            name="room_type"
            value={formData.room_type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Einzelzimmer</option>
            <option value="2">Doppelzimmer</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Pflegegrad *</Label>
          <Select
            name="care_level"
            value={formData.care_level}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Basic</option>
            <option value="2">Demenz</option>
            <option value="3">intensiv</option>
            <option value="4">kurzfristig</option>
          </Select>
        </FormGroup>

        {/* AVAILABLE SPOTS */}
        <FormGroup>
          <Label>Verfügbare Plätze</Label>
          <Input
            type="number"
            name="available_spots"
            value={formData.available_spots}
            onChange={handleInputChange}
          />
        </FormGroup>

        {/* PRIORITY SCORE */}
        <FormGroup>
          <Label>Prioritätspunkt</Label>
          <Input
            type="number"
            name="priority_score"
            value={formData.priority_score}
            onChange={handleInputChange}
          />
        </FormGroup>

        {/* PLAN LEVEL */}
        {editData && (
          <FormGroup>
            <Label>Plan Level</Label>
            <Select
              name="plan_level_cached"
              value={formData.plan_level_cached}
              disabled   // readonly behavior
            >
              <option value="">Select</option>
              <option value="free">Frei</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Unternehmen</option>
            </Select>
            <input
              type="hidden"
              name="plan_level_cached"
              value={formData.plan_level_cached}
            />
          </FormGroup>
        )}


        {/* STATUS */}
        <FormGroup>
          <Label>Status</Label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
            <option value="draft">Entwurf</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Preis pro Monat *</Label>
          <Input
            name="price_per_month"
            value={formData.price_per_month}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Verfügbarkeit *</Label>
          <Select
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Sofort</option>
            <option value="2">Bald</option>
            <option value="3">Auf Anfrage</option>
          </Select>
        </FormGroup>

        {/* DESCRIPTION */}
        <FormGroup style={{ gridColumn: "1 / -1" }}>
          <Label>Beschreibung</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </FormGroup>

        {/* ADDRESS */}
        <h3 style={{ gridColumn: "1 / -1" }}>Adresse :</h3>

        <FormGroup>
          <Label>Straße *</Label>
          <Input
            name="address_street"
            value={formData.address_street}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Postleitzahl *</Label>
          <Input
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Stadt *</Label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <h3 style={{ gridColumn: "1 / -1" }}>
          Optional: Latitude & Longitude fields for distance calculation
        </h3>

        <FormGroup>
          <Label>Breitengrad</Label>
          <Input
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Längengrad</Label>
          <Input
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
          />
        </FormGroup>

        {/* PHOTOS */}
        <PhotosWrapper>
          <Label>Fotos hochladen</Label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
          />

          <PhotoPreviewContainer>
            {photos.filter(img => !img.toDelete).map((img, index) => (
              <ImgPreview key={index}>
                <PreviewImage src={img.url} />
                <RemoveImgBtn onClick={() => removePhoto(index)}>×</RemoveImgBtn>

                <Input
                  type="text"
                  placeholder="Alt-Text eingeben"
                  value={img.alt_text}
                  onChange={(e) => {
                    const newPhotos = [...photos];
                    newPhotos[index].alt_text = e.target.value;
                    setPhotos(newPhotos);
                  }}
                  style={{ marginTop: "5px", width: "95px", fontSize: "0.8rem" }}
                />
              </ImgPreview>
            ))}

          </PhotoPreviewContainer>

        </PhotosWrapper>

        {/* SUBMIT BUTTONS */}
        <ButtonRow>
          <SaveButton type="submit">
            {editData ? "Aktualisieren" : "Speichern"}
          </SaveButton>
          <CancelButton type="button" onClick={onBack}>
            Abbrechen
          </CancelButton>
        </ButtonRow>
      </AddSpotForm>
    </AddSpotContainer>
  );
};

// ✅ Export at the end
export default AddSpotPage;

