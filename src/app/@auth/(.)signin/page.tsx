'use client'
import LoginForm from "@/app/ui/login-form/login-form";
import {useEffect, useState} from "react";
import Modal from "react-modal";
import ModalUI from "@/app/ui/modal/modal";

export default function SigninModal() {
  const [isModalShowing, setShowModal] = useState(false)
  useEffect(() => {
        Modal.setAppElement('#root');
        setShowModal(true)
    }, [])
  return (
          <ModalUI isModalShowing={isModalShowing} setShowModal={setShowModal}>
              <LoginForm/>
          </ModalUI>
  );
}