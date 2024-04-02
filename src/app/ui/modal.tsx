'use client'
import Modal from 'react-modal';
import {useEffect, useState} from "react";

export default function ModalUI({
  children, isModalShowing, setShowModal
}: Readonly<{
  children: React.ReactNode;
  isModalShowing: boolean;
  setShowModal: (value: (((prevState: boolean) => boolean) | boolean)) => void
}>) {
  return (
      <Modal isOpen={isModalShowing}
      closeTimeoutMS={300}
      onRequestClose={() => setShowModal(false)}>
          {children}
      </Modal>
  );
}