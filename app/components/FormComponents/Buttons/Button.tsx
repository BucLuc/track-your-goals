'use client'
import styles from './Button.module.css'

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset' | undefined;
    fullwidth?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    type,
    fullwidth,
    children,
    onClick,
    secondary,
    danger,
    disabled
}) => {
    return (
        <button onClick={onClick} type={type} disabled={disabled} className={secondary ? styles.secondary : styles.primary}style={{ width: fullwidth ? '100%' : 'auto' }}>
            {children}
        </button>
    )
}

export default Button;