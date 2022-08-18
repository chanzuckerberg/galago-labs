import Header from "../components/header";
import LandingPage from "../components/landingPage";

export const LandingPageRoute = () => {
  console.log("heyx3, dropped base path final slash"); // REMOVE
  console.log("impor meta env MODE", import.meta.env.MODE); // REMOVE
  console.log("impor meta env BASE_URL", import.meta.env.BASE_URL); // REMOVE
  console.log("impor meta env PROD", import.meta.env.PROD); // REMOVE
  console.log("impor meta env SSR", import.meta.env.SSR); // REMOVE
  return (
    <div>
      <Header />
      <LandingPage />
    </div>
  );
};

export default LandingPageRoute;
