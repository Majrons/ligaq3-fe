import React from 'react';
import Modal from 'react-modal';
import styles from './ModalComponent.module.scss';

interface IModalComponentProps {
    children: React.ReactNode;
    modalIsOpen: boolean;
    closeModal: (modalState: boolean) => void;
}

const ModalComponent: React.FC<IModalComponentProps> = ({ modalIsOpen, children, closeModal }) => {
    return (
        <Modal isOpen={modalIsOpen} overlayClassName={styles.modalContainerBackdrop} className={styles.modalContainer}>
            <div className={styles.modal}>
                <div onClick={() => closeModal(false)} className={styles.modalClose}>
                    X
                </div>
                <div className={styles.modalContent}>{children}</div>
            </div>
        </Modal>
    );
};

export default ModalComponent;
