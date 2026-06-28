import { createContext, useContext, useState, useCallback } from "react";
import BookAppointmentModal from "../components/shared/Modals/BookAppointmentModal";

const ModalContext = createContext();

export const useModal = () => {
  return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitCallback, setSubmitCallback] = useState(null);

  const openModal = useCallback((onSubmit) => {
    setSubmitCallback(() => onSubmit);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Give time for exit animation before clearing callback
    setTimeout(() => {
      setSubmitCallback(null);
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
      />
    </ModalContext.Provider>
  );
};
