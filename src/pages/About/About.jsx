import { motion } from "framer-motion";
import { FaHeartbeat, FaUserMd, FaGlobe, FaHandsHelping, FaShieldAlt, FaHospital, FaClock } from "react-icons/fa";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    { label: "Active Patients", value: "10,000+", icon: <FaHeartbeat /> },
    { label: "Verified Doctors", value: "500+", icon: <FaUserMd /> },
    { label: "Consultations", value: "50,000+", icon: <FaGlobe /> },
    { label: "Hospitals Partnered", value: "50+", icon: <FaHospital /> },
  ];

  const values = [
    {
      title: "Patient-Centric Care",
      description: "We put patients first. Every feature of our platform is built to make your healthcare more accessible, clear, and easily manageable.",
      icon: <FaHandsHelping className="text-4xl text-teal-500 mb-4" />
    },
    {
      title: "Trusted Professionals",
      description: "Every doctor on our platform undergoes a rigorous verification process. We ensure you only connect with licensed, highly-rated medical experts.",
      icon: <FaUserMd className="text-4xl text-blue-500 mb-4" />
    },
    {
      title: "Data Security",
      description: "Your health records are highly sensitive. We employ bank-level encryption and strict privacy protocols to ensure your data remains strictly confidential.",
      icon: <FaShieldAlt className="text-4xl text-indigo-500 mb-4" />
    },
    {
      title: "24/7 Availability",
      description: "Healthcare needs don't follow a schedule. Our platform is accessible around the clock, ensuring you can find help whenever an emergency arises.",
      icon: <FaClock className="text-4xl text-orange-500 mb-4" />
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-inter pb-20">

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 w-full h-full bg-[#0b6e66] skew-y-3 transform origin-top-right -z-10 opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-16 lg:pb-24 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 mb-6 leading-tight">
              Bridging the Gap Between <span className="text-primary">Patients</span> and <span className="text-primary">Quality Care</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              MediCare Connect was founded on a simple belief: everyone deserves easy access to world-class healthcare. We are building the digital infrastructure to make finding, booking, and managing medical care a seamless experience.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl -mt-12 lg:-mt-16 relative z-20">

        {/* Stats Section */}
        <motion.div
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 md:p-12 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100">
            {stats.map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants} className="text-center px-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-600 text-2xl mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-poppins font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2">
              <div className="bg-teal-50 border border-teal-100 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-200 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>

                <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-6 relative z-10">Our Mission</h2>
                <p className="text-gray-700 text-lg leading-relaxed relative z-10 font-medium text-justify">
                  To empower individuals to take control of their health by providing a transparent, reliable, and user-friendly platform that connects them with the best medical professionals globally. We strive to eliminate the friction in healthcare navigation, ensuring that a doctor is always just a click away.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Medical Team"
                className="w-full h-[400px] object-cover rounded-3xl shadow-lg border border-gray-100"
              />
            </div>
          </div>
        </motion.div>

        {/* Core Values */}
        <div className="mb-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">The principles that guide every decision we make and every line of code we write.</p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {value.icon}
                <h3 className="text-lg font-bold font-poppins text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default About;
