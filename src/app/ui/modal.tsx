'use client'
import Modal from 'react-modal';
import {useRouter} from "next/router";
export default function Modal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const router = useRouter()
    const handleRequestClose = () => {
        router.back();
    }
  return (
      <Modal isOpen={true}
             closeTimeoutMS={300}
             onRequestClose={handleRequestClose}
      >
          {children}
      </Modal>
  );
}