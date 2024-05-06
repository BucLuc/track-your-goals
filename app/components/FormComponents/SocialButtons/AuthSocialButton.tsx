'use client'
import { IconType } from 'react-icons';

import styles from './AuthSocialButton.module.css'

interface ButtonProps {
    fullwidth?: boolean,
    text?: string,
    onClick?: () => void,
    icon: IconType;
}

const AuthSocialButton: React.FC<ButtonProps> = ({
    fullwidth, text, onClick, icon: Icon
}) => {
    return (
        <button type='button' onClick={onClick} className={styles['social-button']}>
            <Icon />
            {text}
        </button>
    )
}

export default AuthSocialButton;