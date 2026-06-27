import { motion } from "framer-motion";
import { FaStar, FaQuoteRight } from "react-icons/fa";

const stories = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Patient",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "MediCare Connect made it so easy to find the right doctor and book appointments. Highly recommended!",
  },
  {
    id: 2,
    name: "Mahmudul Hasan",
    role: "Patient",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The platform is user-friendly and the doctors are very professional. Great experience!",
  },
  {
    id: 3,
    name: "Laila Akter",
    role: "Patient",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Quick appointment, minimal wait time, and excellent consultation. Thanks MediCare Connect!",
  },
];

const PatientSuccessStories = () => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-[32px] font-poppins font-bold text-gray-900 mb-3">
            Patient Success Stories
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex text-yellow-400 mb-4 text-sm gap-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                
                <p className="text-gray-600 font-inter text-sm mb-8 flex-grow leading-relaxed">
                  "{story.text}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-poppins font-bold text-gray-900 text-sm">{story.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{story.role}</p>
                  </div>
                </div>
                
                <div className="absolute bottom-6 right-8 text-primary opacity-20">
                  <FaQuoteRight className="text-3xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientSuccessStories;
