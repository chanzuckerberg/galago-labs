import Header from "../components/header";
import LandingPage from "../components/landingPage";

export const LandingPageRoute = () => {
  console.log("Routes swapped over. Yay root domains!"); // REMOVE
  return (
    <div>
      <Header />
      <LandingPage />
    </div>
  );
};

export default LandingPageRoute;
