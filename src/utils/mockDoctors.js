import doctorFemaleImg from "../assets/doctor-female.png";
import doctorMaleImg from "../assets/doctor-male.png";

const generateAvailability = () => {
  return [
    { day: "Monday", slots: ["10:00 AM", "12:00 PM", "04:00 PM"] },
    { day: "Wednesday", slots: ["11:00 AM", "02:00 PM", "05:00 PM"] },
    { day: "Friday", slots: ["09:00 AM", "01:00 PM", "06:00 PM"] }
  ];
};

const generateReviews = () => {
  return [
    {
      id: 1,
      patient: "Rahim Uddin",
      rating: 5,
      date: "Oct 12, 2023",
      comment: "Very professional and patient. Listened to all my concerns and prescribed the right medication."
    },
    {
      id: 2,
      patient: "Sumaiya Akter",
      rating: 4,
      date: "Sep 28, 2023",
      comment: "The consultation was great, but I had to wait 15 minutes past my appointment time."
    }
  ];
};

export const mockDoctors = [
  {
    id: 1,
    name: "Dr. Arman Hossain",
    specialty: "Cardiologist",
    experience: "10+ Years Exp.",
    experienceYears: 10,
    image: doctorMaleImg,
    rating: 4.9,
    reviews: 120,
    fee: "$700",
    feeAmount: 700,
    bio: "Dr. Arman Hossain is a highly respected Cardiologist with over 10 years of experience in treating complex heart conditions. He is dedicated to providing compassionate care and utilizing the latest medical advancements to ensure the best outcomes for his patients.",
    qualifications: ["MBBS, Dhaka Medical College", "MD (Cardiology), BSMMU", "Fellowship in Interventional Cardiology (USA)"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 2,
    name: "Dr. Nusrat Jahan",
    specialty: "Dermatologist",
    experience: "8+ Years Exp.",
    experienceYears: 8,
    image: doctorFemaleImg,
    rating: 4.8,
    reviews: 98,
    fee: "$600",
    feeAmount: 600,
    bio: "Dr. Nusrat Jahan specializes in medical and cosmetic dermatology. She has helped thousands of patients achieve healthy, glowing skin through personalized treatment plans and advanced dermatological procedures.",
    qualifications: ["MBBS, Sir Salimullah Medical College", "FCPS (Dermatology)", "Advanced Training in Laser Therapy"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 3,
    name: "Dr. Rifat Hasan",
    specialty: "Neurologist",
    experience: "12+ Years Exp.",
    experienceYears: 12,
    image: doctorMaleImg,
    rating: 4.9,
    reviews: 150,
    fee: "$800",
    feeAmount: 800,
    bio: "Dr. Rifat Hasan is a leading Neurologist known for his expertise in treating stroke, epilepsy, and neurodegenerative disorders. His patient-first approach makes him one of the most sought-after specialists in the city.",
    qualifications: ["MBBS, DMC", "MD (Neurology), BIRDEM", "MRCP (UK)"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 4,
    name: "Dr. Farhana Islam",
    specialty: "Pediatrician",
    experience: "6+ Years Exp.",
    experienceYears: 6,
    image: doctorFemaleImg,
    rating: 4.7,
    reviews: 85,
    fee: "$500",
    feeAmount: 500,
    bio: "Dr. Farhana Islam is a compassionate Pediatrician who focuses on the physical and mental well-being of children. She ensures a friendly and comfortable environment for all her young patients.",
    qualifications: ["MBBS, Shaheed Suhrawardy Medical College", "DCH, BSMMU"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 5,
    name: "Dr. Kamal Ahmed",
    specialty: "Orthopedic",
    experience: "15+ Years Exp.",
    experienceYears: 15,
    image: doctorMaleImg,
    rating: 4.6,
    reviews: 210,
    fee: "$1000",
    feeAmount: 1000,
    bio: "Dr. Kamal Ahmed is an expert Orthopedic Surgeon with 15 years of experience in joint replacements, sports injuries, and trauma surgery.",
    qualifications: ["MBBS", "MS (Orthopedics)", "Fellowship in Joint Replacement"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 6,
    name: "Dr. Sadia Rahman",
    specialty: "Gynecologist",
    experience: "9+ Years Exp.",
    experienceYears: 9,
    image: doctorFemaleImg,
    rating: 4.9,
    reviews: 180,
    fee: "$700",
    feeAmount: 700,
    bio: "Dr. Sadia Rahman is dedicated to women's health, offering comprehensive care in obstetrics and gynecology, with a special focus on high-risk pregnancies.",
    qualifications: ["MBBS", "FCPS (Obs & Gynae)"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 7,
    name: "Dr. Tariqul Islam",
    specialty: "Cardiologist",
    experience: "20+ Years Exp.",
    experienceYears: 20,
    image: doctorMaleImg,
    rating: 5.0,
    reviews: 320,
    fee: "$1200",
    feeAmount: 1200,
    bio: "A pioneer in Cardiology, Dr. Tariqul Islam has saved countless lives through his expertise in complex heart surgeries and chronic disease management.",
    qualifications: ["MBBS", "MD (Cardiology)", "FACC"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 8,
    name: "Dr. Ayesha Siddiqa",
    specialty: "Neurologist",
    experience: "5+ Years Exp.",
    experienceYears: 5,
    image: doctorFemaleImg,
    rating: 4.5,
    reviews: 65,
    fee: "$500",
    feeAmount: 500,
    bio: "Dr. Ayesha Siddiqa is a dedicated Neurologist specializing in migraine and sleep disorders. She believes in holistic and patient-centered care.",
    qualifications: ["MBBS", "MD (Neurology)"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 9,
    name: "Dr. Mahmudul Hasan",
    specialty: "Dermatologist",
    experience: "11+ Years Exp.",
    experienceYears: 11,
    image: doctorMaleImg,
    rating: 4.8,
    reviews: 140,
    fee: "$800",
    feeAmount: 800,
    bio: "Dr. Mahmudul Hasan combines his deep medical knowledge with aesthetic expertise to provide state-of-the-art dermatological treatments.",
    qualifications: ["MBBS", "DDV", "MCPS"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 10,
    name: "Dr. Tahmina Akter",
    specialty: "Pediatrician",
    experience: "14+ Years Exp.",
    experienceYears: 14,
    image: doctorFemaleImg,
    rating: 4.9,
    reviews: 250,
    fee: "$900",
    feeAmount: 900,
    bio: "Known for her exceptional rapport with children, Dr. Tahmina provides top-tier pediatric care focusing on early childhood development and nutrition.",
    qualifications: ["MBBS", "FCPS (Pediatrics)"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 11,
    name: "Dr. Shafiqul Alam",
    specialty: "Orthopedic",
    experience: "7+ Years Exp.",
    experienceYears: 7,
    image: doctorMaleImg,
    rating: 4.4,
    reviews: 90,
    fee: "$600",
    feeAmount: 600,
    bio: "Dr. Shafiqul Alam specializes in spinal conditions and physical rehabilitation, helping patients regain their mobility and quality of life.",
    qualifications: ["MBBS", "D-Ortho"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  },
  {
    id: 12,
    name: "Dr. Nabila Chowdhury",
    specialty: "Gynecologist",
    experience: "3+ Years Exp.",
    experienceYears: 3,
    image: doctorFemaleImg,
    rating: 4.3,
    reviews: 45,
    fee: "$400",
    feeAmount: 400,
    bio: "A highly motivated and caring Gynecologist, Dr. Nabila is committed to promoting maternal health and wellness in her community.",
    qualifications: ["MBBS", "DGO"],
    availability: generateAvailability(),
    reviewsList: generateReviews()
  }
];
