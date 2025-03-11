"use client";
import React, { useEffect, useState } from "react";
import CreateCrewModal from "./create-crew-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateCrewModal />
    </>
  );
};

export default ModalProvider;
