"use client";
import { useEffect, useState } from "react";
import CreateChannelModal from "./create-channel-modal";
import CreateCrewModal from "./create-crew-modal";
import EditCrewModal from "./edit-crew-modal";
import InviteModal from "./invite-modal";
import MembersModal from "./members-modal";

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
      <MembersModal />
      <CreateChannelModal />
    </>
  );
};

export default ModalProvider;
