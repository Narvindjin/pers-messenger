'use client'
import Modal from 'react-modal';
import {useRouter} from "next/navigation";
import {ModalStyle, OverlayStyle} from "@/app/ui/modal/style";

export default function ModalUI({
  children, isModalShowing, setShowModal
}: Readonly<{
  children: React.ReactNode;
  isModalShowing: boolean;
  setShowModal: (value: (((prevState: boolean) => boolean) | boolean)) => void
}>) {
  const router = useRouter()
  return (
      <Modal isOpen={isModalShowing}
             closeTimeoutMS={300}
             className="_"
             overlayClassName="_"
             onRequestClose={() => setShowModal(false)}
             onAfterClose={() => router.back()}
             contentElement={(props, children) => <ModalStyle {...props}>{children}</ModalStyle>}
             overlayElement={(props, contentElement) => <OverlayStyle {...props}>{contentElement}</OverlayStyle>}
      >
          {children}
      </Modal>
  );
}