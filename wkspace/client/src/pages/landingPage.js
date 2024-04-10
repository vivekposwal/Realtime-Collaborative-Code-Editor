import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./LandingPage.module.css";
const LandingPage = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push("/index"); // Redirect to the IndexPage
  };

  return (
    <div className={styles.main}>
      <h1>Kode2gather</h1>
      <button onClick={handleClick}>
        Enter into Collaborative Coding World
      </button>
    </div>
  );
};

export default LandingPage;
