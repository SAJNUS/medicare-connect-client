import { motion } from "framer-motion";
import { FaStar, FaArrowRight } from "react-icons/fa";
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
            <motion.div
              key={doctor.id}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex p-4 pb-5 flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex gap-4 mb-4">
                <div className="bg-gray-100 rounded-xl overflow-hidden w-28 h-36 flex-shrink-0 relative">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-grow py-1">

                  <h3 className="text-base font-poppins font-bold text-gray-900 leading-tight mb-1">{doctor.name}</h3>
                  <p className="text-gray-500 font-inter text-xs mb-0.5">{doctor.specialty}</p>
                  <p className="text-gray-500 font-inter text-xs mb-2">{doctor.experience}</p>
                  <div className="flex items-center text-xs font-bold text-gray-800">
                    <FaStar className="text-yellow-400 mr-1" />
                    {doctor.rating} <span className="text-gray-400 font-normal ml-1">({doctor.reviews})</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">{doctor.fee}</p>
                    <p className="text-gray-400 text-[11px]">Consultation Fee</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> Available
                  </span>
                </div>
                <button className="bg-primary hover:bg-primary-focus text-white w-full rounded-md py-2.5 text-sm font-medium transition-colors">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
