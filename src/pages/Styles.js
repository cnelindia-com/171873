import styled from "styled-components";
import "../css/theme.css"; // 🌈 Import global theme variables

// ====================== CONTAINER ======================
export const Container = styled.div`
  max-width: 1300px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: var(--font-base);
  color: var(--color-text-main);
  background: var(--color-background);
`;

// ====================== HEADER ======================
export const SearchHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  color: var(--color-primary-dark);
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
`;

// ====================== FORM ======================
export const Form = styled.form`
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px var(--color-shadow);
  margin-bottom: 2rem;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.9rem;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.4rem;
  color: var(--color-text-main);
  font-size: 0.92rem;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 96%;
  padding: 0.7rem;
  border: 1.5px solid var(--color-text-main);
  border-radius: 7px;
  font-size: 0.95rem;
  // background: var(--color-surface-alt);
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.7rem;
  border: 1.5px solid var(--color-text-main);
  border-radius: 7px;
  font-size: 0.95rem;
  // background: var(--color-surface-alt);
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export const SearchBtn = styled.button`
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 7px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0.8rem auto 0;
  display: block;
  transition: 0.3s ease;
  &:hover {
    background: var(--color-primary-dark);
  }
`;

// ====================== RESULTS PAGE ======================
export const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 4.8rem;
  margin-top: 2rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Card = styled.div`
 position: relative;
  background: var(--color-surface);
  padding: 1.6rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px var(--color-shadow);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 25px var(--color-shadow-hover);
  }
`;

export const Name = styled.h3`
  font-size: 1.22rem;
  color: var(--color-primary-dark);
  margin: 0 0 0.5rem 0;
`;

export const Address = styled.p`
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  margin: 0.5rem 0 1rem;
  line-height: 1.4;
`;

export const Details = styled.div`
  font-size: 0.88rem;
  margin-bottom: 1.2rem;
`;

export const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.45rem 0;
`;

export const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: 0.8rem;
`;

export const DetailsBtn = styled.button`
  background: var(--color-success);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 7px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: 0.3s ease;
  &:hover {
    background: var(--color-success);
  }
`;

// ====================== DETAIL PAGE ======================
export const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary-dark);
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  opacity: 0.8;
  &:hover {
    text-decoration: underline;
    opacity: 1;
  }
`;

export const HeaderCard = styled.div`
  background: var(--color-surface);
  padding: 1.8rem;
  border-radius: 14px;
  box-shadow: 0 6px 22px var(--color-shadow);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.2rem;
`;

export const HeaderTitle = styled.h1`
  color: var(--color-text-main);
  font-size: 2rem;
  margin: 0;
`;

export const HeaderSub = styled.p`
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 1rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

export const PrimaryBtn = styled.button`
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 0.75rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: var(--color-primary-dark);
  }
`;

export const GhostBtn = styled.button`
  padding: 0.75rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    filter: brightness(0.95);
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 0.8rem;
  @media (min-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const InfoCard = styled.div`
  background: var(--color-surface);
  border-radius: 14px;
  box-shadow: 0 6px 22px var(--color-shadow);
  padding: 1.2rem 1.4rem;
`;

export const SectionTitle = styled.h3`
  color: var(--color-primary-dark);
  font-size: 1.2rem;
  margin: 0 0 0.8rem 0;
`;

export const KV = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.6rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--color-border);
  &:last-child {
    border-bottom: none;
  }
`;

export const Key = styled.span`
  color: var(--color-text-secondary);
`;

export const Value = styled.span`
  color: var(--color-text-main);
  font-weight: 600;
`;

export const ContactBox = styled.div`
  // background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.9rem 1rem;
  display: grid;
  gap: 0.6rem;
`;

export const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-text-main);
  font-size: 0.95rem;
`;

export const AboutCard = styled(InfoCard)`
  grid-column: 1 / -1;
`;

export const Bullet = styled.li`
  margin: 0.25rem 0;
  color: var(--color-text-main);
`;

export const SuccessAlert = styled.div`
  background: var(--color-success-light);
  border: 1px solid var(--color-success);
  color: var(--color-success-dark);
  padding: 0.9rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.8rem;
  font-weight: 600;
`;

export const FormField = styled.input`
  width: 100%;
  padding: 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  margin: 0.35rem 0 0.8rem;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  margin: 0.35rem 0 0.8rem;
  min-height: 110px;
  font-size: 0.95rem;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export const SubmitBtn = styled.button`
  background: var(--color-warning);
  color: #fff;
  border: none;
  padding: 0.85rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: var(--color-warning-dark);
  }
`;

// ====================== PAGINATION ======================
export const PaginationWrapper = styled.div`
  margin-top: 35px;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
`;

export const PageButton = styled.button`
  background: ${(props) =>
    props.disabled ? "var(--color-disabled)" : "var(--color-primary)"};
  color: ${(props) =>
    props.disabled ? "var(--color-text-secondary)" : "#fff"};
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: 0.3s;
  &:hover {
    background: ${(props) =>
      props.disabled ? "var(--color-disabled)" : "var(--color-primary-dark)"};
  }
`;

export const PageInfo = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-main);
`;
