'use client'
import styles from './Button.module.css'
import Loading from '@components/Loading/Loading';

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset' | undefined;
    fullwidth?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    secondary?: boolean;
    green?: boolean;
    disabled?: boolean;
    big?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    type,
    fullwidth,
    children,
    onClick,
    secondary,
    green,
    disabled,
    big
}) => {
    return (
        <button onClick={onClick} type={type} disabled={disabled} className={`${styles.button} ${green ? styles.green : secondary ? styles.secondary : styles.primary}`} style={{ width: fullwidth ? '100%' : 'auto', fontSize: big ? '1.8rem' : '1.2rem'}}>
            {children}
        </button>
    )
}

export default Button;