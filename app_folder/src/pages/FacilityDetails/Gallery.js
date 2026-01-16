import React, { useState, useEffect } from "react";
import {
  GalleryWrapper,
  MainImageWrapper,
  MainImage,
  Thumbs,
  Thumb,
  LightboxOverlay,
  LightboxContent,
  LightboxImage,
  CloseBtn,
  Arrow
} from "./DetailsStyles";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import { ImageUrl } from "../../BaseUrl";
import demo1 from "./images/demo1.jpg";
import demo2 from "./images/demo2.jpg";
import demo3 from "./images/demo3.jpg";
import demo4 from "./images/demo4.jpg";
import demo5 from "./images/demo5.jpeg";
import demo6 from "./images/demo6.jpeg";

const HARD_CODED_IMAGES = [
  { src: demo1, alt: "Demo image 1" },
  { src: demo2, alt: "Demo image 2" },
  { src: demo3, alt: "Demo image 3" },
  { src: demo4, alt: "Demo image 4" },
  { src: demo5, alt: "Demo image 5" },
  { src: demo6, alt: "Demo image 6" }
];

export default function Gallery({ facilityId }) {
  const [images, setImages] = useState(HARD_CODED_IMAGES);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!facilityId) return;

    axios
      .get(`${BaseUrl}place-images/${facilityId}`)
      .then(res => {
        if (res.data?.length) {
          const formattedImages = res.data.map(img => ({
            src: `${ImageUrl}${img.file_url}`,
            alt: img.alt_text || "Image"
          }));
          setImages(formattedImages);
        }
      })
      .catch(() => {
        setImages(HARD_CODED_IMAGES);
      });
  }, [facilityId]);


  const nextImg = () =>
    setActiveImg((prev) => (prev + 1) % images.length);

  const prevImg = () =>
    setActiveImg((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

  return (
    <GalleryWrapper>
      <MainImageWrapper onClick={() => setLightboxOpen(true)}>
        <MainImage src={images[activeImg].src} alt={images[activeImg].alt} />
      </MainImageWrapper>

      <Thumbs>
        {images.map((img, i) => (
          <Thumb
            key={i}
            src={img.src}
            active={i === activeImg}
            alt={img.alt}
            onClick={() => setActiveImg(i)}
          />
        ))}
      </Thumbs>

      {lightboxOpen && (
        <LightboxOverlay>
          <LightboxContent>
            <CloseBtn onClick={() => setLightboxOpen(false)}>×</CloseBtn>

            <Arrow left onClick={prevImg}>‹</Arrow>

            <LightboxImage src={images[activeImg].src} alt={images[activeImg].alt} />

            <Arrow onClick={nextImg}>›</Arrow>
          </LightboxContent>
        </LightboxOverlay>
      )}
    </GalleryWrapper>
  );

}
