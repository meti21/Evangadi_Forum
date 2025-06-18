
import Layout from "../../Components/Layout/Layout";

import { Route, Routes } from "react-router-dom";
import Register from "../../Components/Register/Register";
import SignIn from "../../Components/SignIn/SignIn";
import About from "../../components/About/About";
import styles from "./Landing.module.css";

function Landing() {
  return (
    <Layout>
      <section className={styles.landingContainer}>
        
        {/* Left side: form section */}
        <div className={styles.authSection}>
          <div className={styles.authBox}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<SignIn />} />
              <Route path="/signIn" element={<SignIn />} />
            </Routes>
          </div>
        </div>

        {/* Right side: image + about overlay */}
        <div className={styles.aboutSection}>
          <div className={styles.aboutOverlay}>
            <h2 className={styles.aboutTitle}>About Us</h2>
            <About />
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Landing;
