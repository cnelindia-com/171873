import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Overview from "./Overview";
import {
 MainContent
} from "./StyledComponents";
function NursingHomeDashboard() {
  const navigate = useNavigate();
 
  const userName = localStorage.getItem("pflegeUserName");
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("pflegeLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  }, []);
  return (
      <MainContent>
          <Overview></Overview>
      </MainContent>
  );
}

export default NursingHomeDashboard;
