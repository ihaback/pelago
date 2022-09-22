import React, { createContext, useCallback, useContext, useState } from "react";

type AuthModalProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const AuthModalContext = createContext({} as AuthModalProps);

export const AuthModalWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <AuthModalContext.Provider
      value={{ openModal, closeModal, showModal, setShowModal }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModalContext = () => {
  return useContext(AuthModalContext);
};
