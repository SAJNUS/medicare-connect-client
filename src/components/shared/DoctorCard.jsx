import { motion } from "framer-motion";
import { FaStar, FaHeartbeat, FaBrain, FaBaby, FaBone, FaUserMd, FaVenus, FaTooth, FaHeadSideVirus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const getSpecialtyIcon = (specialty) => {
  const s = specialty.toLowerCase();
  if (s.includes("cardiology")) return <FaHeartbeat className="mr-1.5 text-primary" />;
  if (s.includes("neurology")) return <FaBrain className="mr-1.5 text-primary" />;
  if (s.includes("pediatrics")) return <FaBaby className="mr-1.5 text-primary" />;
  if (s.includes("orthopedics")) return <FaBone className="mr-1.5 text-primary" />;
  if (s.includes("dermatology")) return <FaUserMd className="mr-1.5 text-primary" />;
  if (s.includes("gynecology")) return <FaVenus className="mr-1.5 text-primary" />;
  if (s.includes("dentistry")) return <FaTooth className="mr-1.5 text-primary" />;
  if (s.includes("psychiatry")) return <FaHeadSideVirus className="mr-1.5 text-primary" />;
  return null;
};

const DoctorCard = ({ doctor, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/doctors/${doctor.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex p-4 pb-5 flex-col h-full cursor-pointer transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
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
          {doctor.designation && <p className="text-[#0b6e66] font-inter font-medium text-[11px] mb-0.5">{doctor.designation}</p>}
          <p className="text-gray-500 font-inter text-xs mb-0.5 flex items-center">{getSpecialtyIcon(doctor.specialty)} {doctor.specialty}</p>
          <p className="text-gray-500 font-inter text-xs mb-2">{doctor.experience}</p>
          <div className="flex items-center text-xs font-bold text-gray-800">
            <FaStar className="text-yellow-400 mr-1" />
            {doctor.rating} <span className="text-gray-400 font-normal ml-1">({doctor.reviews} Reviews)</span>
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
  );
};

export default DoctorCard;
