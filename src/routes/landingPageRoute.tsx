import Header from "../components/header";
import LandingPage from "../components/landingPage";

export const LandingPageRoute = () => {
  console.log("Let us scope out that multi line secret, friend!"); // REMOVE
  console.log("importXmetaXenvXMODE", import.meta.env.MODE); // REMOVE
  return (
    <div>
      <Header />
      <LandingPage />
    </div>
  );
};

export default LandingPageRoute;
