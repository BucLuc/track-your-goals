import styles from './CustomModal.module.css'

interface Props {
    open?: boolean;
    children?: React.ReactNode;
    onClose?: () => void;
}

const CustomModal: React.FC<Props> = ({ open = false, children, onClose }) => {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            open = false
        }
    };
    return (
        <>
            {open && (
                <div className={styles.modalOverlay} onClick={handleOverlayClick}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={onClose}>
                            &times;
                        </button>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default CustomModal;