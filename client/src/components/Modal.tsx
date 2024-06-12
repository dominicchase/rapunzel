import React, { ReactNode, SetStateAction } from "react";

type Props = {
  children: ReactNode;
  show: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
};

function Modal({ children, show, setShow }: Props) {
  return show ? (
    <div className="modal">
      <div className="modal-content">
        <section>{children}</section>
        <button className="modal-close-btn" onClick={() => setShow(false)}>
          &times;
        </button>
      </div>
    </div>
  ) : null;
}

export default Modal;
