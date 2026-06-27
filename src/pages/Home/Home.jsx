import HeroBanner from "./HeroBanner";
import MedicalSpecializations from "./MedicalSpecializations";
import FeaturedDoctors from "./FeaturedDoctors";
import Statistics from "./Statistics";
import PatientSuccessStories from "./PatientSuccessStories";
import WhyChooseUs from "./WhyChooseUs";
import EmergencyCTA from "./EmergencyCTA";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <MedicalSpecializations />
      <FeaturedDoctors />
      <Statistics />
      <WhyChooseUs />
      <PatientSuccessStories />
      <EmergencyCTA />
    </div>
  );
};

export default Home;
