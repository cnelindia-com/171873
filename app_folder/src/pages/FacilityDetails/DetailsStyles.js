import styled from "styled-components";

/* PAGE WRAPPER */
export const PageWrapper = styled.div`
  padding: 2rem;
`;

/* TOP GRID */
export const TopGrid = styled.div`
  display: grid;
  grid-template-areas: 
    "gallery infoCard";
  grid-template-columns: 2fr 1fr; /* gallery takes 2/3, info card 1/3 */
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-areas:
      "gallery"
      "infoCard";
    grid-template-columns: 1fr;
  }
`;

/* GALLERY */
export const GalleryWrapper = styled.div`
  width: 100%;
`;

export const MainImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;   /* 🔥 important */
  overflow: hidden;
  border-radius: 12px;
  background: #eee;
  height: 400px;
`;

export const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;   /* 🔥 div full cover kare */
`;

export const Thumbs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const Thumb = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: ${({ active }) => (active ? 1 : 0.6)};
  border: ${({ active }) => (active ? "2px solid #4f46e5" : "none")};
`;

/* INFO CARD */
export const InfoCardWrapper = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 14px;
  box-shadow: 0 2px 8px var(--color-shadow);
`;

export const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: 0.4rem;
`;

export const Address = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

export const Price = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
`;

/* AVAILABILITY BADGE */
export const Badge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: white;
  margin-bottom: 1rem;
  background: ${({ status }) =>
    status === "1" ? "#16a34a" : status === "2" ? "#f59e0b" : "#9ca3af"};
`;

/* CTA */
export const CTAButton = styled.button`
  width: 100%;
  background: #4f46e5;
  color: white;
  padding: 0.8rem;
  border-radius: 10px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    background: #4338ca;
  }
`;

/* SECTIONS */
export const Section = styled.section`
  margin-top: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.8rem;
`;
// Add these two:
export const FieldLabel = styled.span`
  font-weight: 600;
  display: inline-block;
  margin-right: 0.5rem;
`;

export const FieldValue = styled.span`
  font-weight: 400;
  color: #333;
`;
export const FactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

export const FactCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  box-shadow: 0 2px 8px var(--color-shadow);;
`;

export const FactIcon = styled.div`
  font-size: 20px;
`;

export const FactText = styled.div`
  font-size: 14px;
  color: #333;
`;
/* LIGHTBOX STYLES */
export const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const LightboxContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
`;

export const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  font-size: 32px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;

export const Arrow = styled.button`
  position: absolute;
  top: 50%;
  ${props => props.left ? "left: -60px;" : "right: -60px;"}
  transform: translateY(-50%);
  font-size: 40px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;

