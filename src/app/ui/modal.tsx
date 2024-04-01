'use client'
import Modal from 'react-modal';
import {useRouter} from "next/router";
import {useState} from "react";

export default function Modal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    console.log('modal');
    const [modalIsOpen, setIsOpen] = useState(false);
  return (
      <Modal isOpen={modalIsOpen}
             closeTimeoutMS={300}
             ariaHideApp={false}
      >
          {children}
      </Modal>
  );
}