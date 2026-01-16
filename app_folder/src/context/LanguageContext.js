import { createContext, useContext, useState} from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem("lang") || "de");

  const changeLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    setLanguage(lang);
  };
  

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => useContext(LanguageContext);
