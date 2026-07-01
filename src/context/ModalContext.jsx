import { createContext, useContext, useState, useCallback } from "react";
import BookAppointmentModal from "../components/shared/Modals/BookAppointmentModal";

const ModalContext = createContext();

export const useModal = () => {
  return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitCallback, setSubmitCallback] = useState(null);
  const [modalConfig, setModalConfig] = useState({});

  const openModal = useCallback((onSubmit, config = {}) => {
    setSubmitCallback(() => onSubmit);
    setModalConfig(config);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Give time for exit animation before clearing callback
    setTimeout(() => {
      setSubmitCallback(null);
      setModalConfig({});
    }, 500);
  }, []);

  const handleSubmit = (appointment) => {
    if (submitCallback) {
      submitCallback(appointment);
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <BookAppointmentModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        onSubmit={handleSubmit} 
        config={modalConfig}
      />
    </ModalContext.Provider>
  );
};
