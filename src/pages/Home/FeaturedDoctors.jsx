import { FaArrowRight } from "react-icons/fa";
import DoctorCard from "../../components/shared/DoctorCard";
import doctorFemaleImg from "../../assets/doctor-female.png";
import doctorMaleImg from "../../assets/doctor-male.png";

const doctors = [
  {
    id: 1,
    name: "Dr. Arman Hossain",
    specialty: "Cardiologist",
    experience: "10+ Years Exp.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80",
    rating: 4.9,
    reviews: 120,
    fee: "৳700",
  },
  {
    id: 2,
    name: "Dr. Nusrat Jahan",
    specialty: "Dermatologist",
    experience: "8+ Years Exp.",
    image: doctorFemaleImg,
    rating: 4.8,
    reviews: 98,
    fee: "৳600",
  },
  {
    id: 3,
    name: "Dr. Rifat Hasan",
    specialty: "Neurologist",
    experience: "12+ Years Exp.",
    image: doctorMaleImg,
    rating: 4.9,
    reviews: 150,
    fee: "৳800",
  },
  {
    id: 4,
    name: "Dr. Farhana Islam",
    specialty: "Pediatrician",
    experience: "6+ Years Exp.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80",
    rating: 4.7,
    reviews: 85,
    fee: "৳500",
  }
];

const FeaturedDoctors = () => {
  return (
    <section className="py-10 bg-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-[32px] font-poppins font-bold text-gray-900">
            Featured Doctors
          </h2>
          <button className="text-primary font-medium flex items-center hover:underline text-sm md:text-base">
            View All Doctors <FaArrowRight className="ml-2 text-xs" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
