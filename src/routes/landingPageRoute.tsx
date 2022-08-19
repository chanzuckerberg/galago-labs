import Header from "../components/header";
import LandingPage from "../components/landingPage";

export const LandingPageRoute = () => {
  console.log("This version should have built with flag?"); // REMOVE
  console.log("importXmetaXenvXMODE", import.meta.env.MODE); // REMOVE
  return (
    <div>
      <Header />
      <LandingPage />
    </div>
  );
};

export default LandingPageRoute;
