"use client";
import { useEffect, useState } from "react";
import CreateCrewModal from "./create-crew-modal";
import InviteModal from "./invite-modal";
import EditCrewModal from "./edit-crew-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateCrewModal />
      <InviteModal />
      <EditCrewModal />
    </>
  );
};

export default ModalProvider;
