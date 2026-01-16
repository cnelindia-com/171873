import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import { ImageUrl } from "../../BaseUrl";
import "../../css/theme.css"; // ✅ Theme import
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from 'react-i18next';

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
  background: var(--color-dark-background);
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
const AddDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0.8rem 0 1.2rem;
  line-height: 1.4;
  text-align: left;
`;
const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  grid-column: 1 / -1;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0.5rem 0 0.3rem;
`;

const HelperText = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
  line-height: 1.4;
`;

const ImportantBadge = styled.span`
  background: var(--color-dark-background);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
`;


const PriceFormGroup = styled(FormGroup)`
  border: 2px solid var(--color-dark-background);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  background: #f9faff;
`;

const HighlightPhotosWrapper = styled(PhotosWrapper)`
  border: 2px dashed var(--color-dark-background);
  border-radius: 12px;
  padding: 12px;
  background: #f0f4ff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
`;

const PreviewImageStyled = styled(PreviewImage)`
  border: 2px solid var(--color-dark-background);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
`;

// ✅ Properly define the component function here
const AddSpotPage = ({ editData, onBack }) => {
  const PLAN_IMAGE_LIMITS = {
  Free: process.env.REACT_APP_IMAGE_LIMIT_FREE || 15,
  Basic: process.env.REACT_APP_IMAGE_LIMIT_BASIC || 5,
  Pro: process.env.REACT_APP_IMAGE_LIMIT_PRO || 15,
  Enterprise: process.env.REACT_APP_IMAGE_LIMIT_ENTERPRISE || "Unlimited",
};

const pflegeUserId = localStorage.getItem("pflegeUserId");
const token = localStorage.getItem("pflegeUserToken");

useEffect(() => {
  if (!token) return;

  fetch(`${BaseUrl}stripe/current-subscription`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    })
    .then((data) => {
      const plan = data?.planName || "Free"; // fallback
      setCurrentPlan(plan);
      setImageLimit(PLAN_IMAGE_LIMITS[plan] ?? PLAN_IMAGE_LIMITS.Free);
    })
    .catch((err) => {
      console.error("Current plan error:", err);
      setCurrentPlan("Free");
      setImageLimit(PLAN_IMAGE_LIMITS.Free);
    });
}, [token]);


  const initialFormState = {
    name_of_the_place: "",
    room_type: "",
    care_level: "",
    care_types: [],          // NEW: multiple care options
    availability: "",
    price_per_month: "",
    available_from: "",      // NEW: date
    // available_spots: "",     // NEW: numeric
    // priority_score: "",      // NEW: numeric
    plan_level_cached: "",   // NEW: select
    status: "",              // NEW: select
    description: "",
    address_street: "",
    postal_code: "",
    city: "",
    latitude: "",
    longitude: "",
    user_id: "",
  };
  // const { language, changeLanguage } = useLanguage();
  const { t, i18n } = useTranslation();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [imageLimit, setImageLimit] = useState(null);

  const language = i18n.language; // current language (de/en)
  const [formData, setFormData] = useState(initialFormState);
  const [photos, setPhotos] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [desc_en, setDescriptionEn] = useState("");
  const [desc_de, setDescriptionDe] = useState("");
  const userType = localStorage.getItem("pflegeUsertype"); // "admin" | "user"
  console.log("User Type:", userType);
  useEffect(() => {
    if (editData) {
      setFormData({
        name_of_the_place: editData.name_of_the_place,
        room_type: editData.room_type,
        care_level: editData.care_level,
        availability: editData.availability,
        price_per_month: editData.price_per_month,
        // available_spots: editData.available_spots,
        // priority_score: editData.priority_score,
        plan_level_cached: editData.plan_level_cached,
        status: editData.status,
        // description: editData.description,
        // desc_en: editData.desc_en,
        // desc_de: editData.desc_de,
        address_street: editData.address_street,
        city: editData.city,
        postal_code: editData.postal_code,
        latitude: editData.latitude,
        longitude: editData.longitude,
        user_id: editData.user_id,
      });
      // ✅ description JSON se alag set karo
      setDescriptionEn(editData?.desc?.en || "");
      setDescriptionDe(editData?.desc?.de || "");

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

  useEffect(() => {
    if (userType != "2" && !editData) {
      setFormData((prev) => ({
        ...prev,
        user_id: pflegeUserId,
      }));
    }
  }, [userType, editData]);



  useEffect(() => {
    if (userType == "2") {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BaseUrl}users?per_page=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.data.data); // pagination ke andar data
    } catch (err) {
      console.error(err);
      toast.error(t("addSpot.toast.users_load_error"));
    }
  };





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


  // const removePhoto = (index) => {
  //   const newPhotos = [...photos];
  //   if (newPhotos[index].id) {
  //     // Existing image → mark for deletion
  //     newPhotos[index].toDelete = true;
  //   } else {
  //     // New uploaded image → remove from array
  //     newPhotos.splice(index, 1);
  //   }
  //   setPhotos(newPhotos);
  // };
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

  const removePhotoById = (id, index) => {
    setPhotos(prevPhotos =>
      prevPhotos.map((img, i) => {
        if (i === index) {
          if (img.id) return { ...img, toDelete: true }; // mark existing
          else return null; // remove new
        }
        return img;
      }).filter(Boolean)
    );
  };
  const updateAltText = (id, index, text) => {
    setPhotos(prevPhotos =>
      prevPhotos.map((img, i) =>
        i === index ? { ...img, alt_text: text } : img
      )
    );
  };





  // ✅ RETURN always inside the component

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
     toast.error(t("addSpot.toast.login_required"));
      return;
    }

    try {
      let spotId = editData?.id;

      // 1️⃣ Create or update spot
      const spotFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        spotFormData.append(key, value);
      });
      // 🔥 IMPORTANT
      spotFormData.append("desc_en", desc_en);
      spotFormData.append("desc_de", desc_de);
      if (editData) {
        spotFormData.append("_method", "PUT");
        await axios.post(`${BaseUrl}updatespot/${spotId}`, spotFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(t("addSpot.toast.spot_updated"));
      } else {
        const response = await axios.post(`${BaseUrl}addspot`, spotFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Correct path to the new spot ID
        spotId = response.data.data.id;
        toast.success(t("addSpot.toast.spot_added"));
      }
      const photosToUpload = photos.filter(img => !img.toDelete && img.file);
      const imgFormData = new FormData();

      imgFormData.append("place_id", spotId);

      const existingPhotos = [];
      const existingAltTexts = [];
      const existingOrderIndex = [];

      photos.forEach((img, idx) => {
        if (img.id && !img.toDelete) {
          // Existing images to keep
          existingPhotos.push(img.id);
          existingAltTexts.push(img.alt_text);
          existingOrderIndex.push(idx); // front-end order
        } else if (img.file) {
          // New uploaded images
          imgFormData.append("photos[]", img.file);
          imgFormData.append(`alt_text_new[]`, img.alt_text);
          imgFormData.append(`order_index_new[]`, idx);
        }
      });

      // Send existing images info
      existingPhotos.forEach((id, i) => {
        imgFormData.append("existing_photos[]", id);
        imgFormData.append(`alt_text[${i}]`, existingAltTexts[i] ?? "");
        imgFormData.append(`order_index[${i}]`, existingOrderIndex[i]);
      });

      // Only send if there are any photos to process
      if (existingPhotos.length > 0 || photosToUpload.length > 0) {
        await axios.post(`${BaseUrl}place-images`, imgFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // if (photos.length > 0) {
      //   const imgFormData = new FormData();
      //   imgFormData.append("place_id", spotId);

      //   const existingPhotos = [];
      //   const orderIndex = [];
      //   const altTexts = [];

      //   photos.forEach((img, idx) => {
      //     if (img.id) {
      //       // Existing image
      //       if (!img.toDelete) {
      //         existingPhotos.push(img.id);
      //         orderIndex.push(idx);          // optional, for ordering
      //         altTexts.push(img.alt_text);
      //       }
      //     } else if (img.file) {
      //       // New uploaded image
      //       imgFormData.append("photos[]", img.file);
      //       imgFormData.append(`alt_text[${idx}]`, img.alt_text);
      //       orderIndex.push(idx);
      //     }
      //   });

      //   // Send existing images info
      //   existingPhotos.forEach((id, i) => {
      //     imgFormData.append(`existing_photos[]`, id);
      //     imgFormData.append(`alt_text[${i}]`, altTexts[i] ?? '');
      //     imgFormData.append(`order_index[${i}]`, orderIndex[i]);
      //   });

      //   await axios.post(`${BaseUrl}place-images`, imgFormData, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   });
      // }
      onBack(); // Go back after save

    } catch (error) {
      console.error(error);
        const meta = error.response.data.meta || {};
        const code = error?.response?.data?.error_code;
      if (error.response && error.response.data) {
       toast.error(t(`addSpot.errors.${code}`,meta));
      } else {
       toast.error(t("addSpot.toast.save_error"));
      }
    }

  };


  return (
    <AddSpotContainer>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <AddSpotHeader>
        <HeaderLeft>
          <AddSpotTitle>
            {editData ? t("addSpot.edit_title") : t("addSpot.add_title")}
          </AddSpotTitle>

          <AddDescription>
            {t("addSpot.desc")}
          </AddDescription>
        </HeaderLeft>

        <BackButton onClick={onBack}>
          ← {t("addSpot.back")}
        </BackButton>
      </AddSpotHeader>


      <Divider />

      <AddSpotForm onSubmit={handleSubmit}>

        {userType == "2" && (
          <FormGroup>
            <Label>{t("addSpot.fields.user_select")}</Label>
            <Select
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              required
            >
              <option value="">{t("addSpot.fields.select_user")}</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormGroup>
        )}
        {/* BASIC FIELDS */}
        <FormGroup>
          <Label>{t("addSpot.fields.place_name")}</Label>
          <Input
            name="name_of_the_place"
            value={formData.name_of_the_place}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t("addSpot.fields.room_type")}</Label>
          <Select
            name="room_type"
            value={formData.room_type}
            onChange={handleInputChange}
            required
          >
            <option value="">{t("addSpot.fields.select")}</option>
            <option value="1">{t("addSpot.options.single_room")}</option>
            <option value="2">{t("addSpot.options.double_room")}</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t("addSpot.fields.care_level")}</Label>
          <Select
            name="care_level"
            value={formData.care_level}
            onChange={handleInputChange}
            required
          >
            <option value="">{t("addSpot.fields.select")}</option>
            <option value="1">{t("addSpot.options.basic")}</option>
            <option value="2">{t("addSpot.options.dementia")}</option>
            <option value="3">{t("addSpot.options.intensive")}</option>
            <option value="4">{t("addSpot.options.short_term")}</option>
          </Select>
        </FormGroup>

        {/* AVAILABLE SPOTS */}
        {/* <FormGroup>
          <Label>Verfügbare Plätze</Label>
          <Input
            type="number"
            name="available_spots"
            value={formData.available_spots}
            onChange={handleInputChange}
          />
        </FormGroup> */}

        {/* PRIORITY SCORE */}
        {/* <FormGroup>
          <Label>Prioritätspunkt</Label>
          <Input
            type="number"
            name="priority_score"
            value={formData.priority_score}
            onChange={handleInputChange}
          />
        </FormGroup> */}

        {/* PLAN LEVEL */}
        {editData && (
          <FormGroup>
            <Label>{t("addSpot.fields.plan_level")}</Label>
            <Select
              name="plan_level_cached"
              value={formData.plan_level_cached}
              disabled   // readonly behavior
            >
              <option value="">{t("addSpot.fields.select")}</option>
              <option value="free">{t("addSpot.options.free")}</option>
              <option value="basic">{t("addSpot.options.basic")}</option>
              <option value="pro">{t("addSpot.options.pro")}</option>
              <option value="enterprise">{t("addSpot.options.enterprise")}</option>
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
          <Label>{t("addSpot.fields.status")}</Label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="">{t("addSpot.fields.select")}</option>
            <option value="active">{t("addSpot.options.active")}</option>
            <option value="inactive">{t("addSpot.options.inactive")}</option>
            <option value="draft">{t("addSpot.options.draft")}</option>
          </Select>
        </FormGroup>

        <PriceFormGroup>
      <Label>{t("addSpot.fields.price_per_month")}</Label>
      <Input
        name="price_per_month"
        value={formData.price_per_month}
        onChange={handleInputChange}
        required
      />
      <HelperText>
        {t("addSpot.fields.helpers_price")}
      </HelperText>
    </PriceFormGroup>


        <FormGroup>
          <Label>{t("addSpot.fields.availability")}</Label>
          <Select
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            required
          >
            <option value="">{t("addSpot.fields.select")}</option>
            <option value="1">{t("addSpot.options.immediate")}</option>
            <option value="2">{t("addSpot.options.soon")}</option>
            <option value="3">{t("addSpot.options.on_request")}</option>
          </Select>

        </FormGroup>

        {/* DESCRIPTION */}
        {/* <FormGroup style={{ gridColumn: "1 / -1" }}>
          <Label>{t("addSpot.fields.description")}</Label> */}
          {/* <TextArea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          /> */}
          {/* <TextArea
            value={language === "de" ? desc_de : desc_en}
            onChange={(e) =>
              language === "de" ? setDescriptionDe(e.target.value) : setDescriptionEn(e.target.value)
            }
          /> */}

        {/* </FormGroup> */}
        {/* DESCRIPTION */}
<SectionTitle>
  {t("addSpot.fields.description")}
</SectionTitle>

<FormGroup style={{ gridColumn: "1 / -1" }}>
  <Label>{t("addSpot.fields.description")}</Label>

  <TextArea
    value={language === "de" ? desc_de : desc_en}
    onChange={(e) =>
      language === "de"
        ? setDescriptionDe(e.target.value)
        : setDescriptionEn(e.target.value)
    }
  />

  <HelperText>
    {t("addSpot.fields.helpers_desc")}
  </HelperText>
</FormGroup>

        {/* ADDRESS */}
        <h3 style={{ gridColumn: "1 / -1" }}>Adresse :</h3>

        <FormGroup>
          <Label>{t("addSpot.fields.street")}</Label>
          <Input
            name="address_street"
            value={formData.address_street}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t("addSpot.fields.postal_code")}</Label>
          <Input
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t("addSpot.fields.city")}</Label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <h3 style={{ gridColumn: "1 / -1" }}>
          {t("addSpot.fields.lat_lng_note")}
        </h3>

        <FormGroup>
          <Label>{t("addSpot.fields.latitude")}</Label>
          <Input
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t("addSpot.fields.longitude")}</Label>
          <Input
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
          />
        </FormGroup>

        {/* PHOTOS */}
       <HighlightPhotosWrapper>
  <Label>{t("addSpot.fields.upload_photos")}</Label>
  <HelperText style={{ fontSize: "0.85rem", fontWeight: "600", color: "rgb(40, 99, 126)" }}>
  {imageLimit === "Unlimited"
    ? t("addSpot.images.unlimited")
    : t("addSpot.images.limit", { count: imageLimit })}
</HelperText>

  <Input
    type="file"
    multiple
    accept="image/*"
    onChange={handlePhotoUpload}
  />

  <PhotoPreviewContainer>
    {photos.filter(img => !img.toDelete).map((img, index) => (
      <ImgPreview key={img.id || img.url || index}>
        <PreviewImageStyled src={img.url} />
        <RemoveImgBtn onClick={() => removePhotoById(img.id, index)}>×</RemoveImgBtn>
        <Input
          type="text"
          placeholder="Alt-Text eingeben"
          value={img.alt_text}
          onChange={(e) => updateAltText(img.id, index, e.target.value)}
          style={{ marginTop: "5px", width: "95px", fontSize: "0.8rem" }}
        />
      </ImgPreview>
    ))}
  </PhotoPreviewContainer>
</HighlightPhotosWrapper>


        {/* SUBMIT BUTTONS */}
        <ButtonRow>
          <SaveButton type="submit">
            {editData ? t("addSpot.buttons.update") : t("addSpot.buttons.save")}
          </SaveButton>
          <CancelButton type="button" onClick={onBack}>
            {t("addSpot.buttons.cancel")}
          </CancelButton>
        </ButtonRow>
      </AddSpotForm>
    </AddSpotContainer>
  );
};

// ✅ Export at the end
export default AddSpotPage;

