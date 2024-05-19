'use client'

import styles from './AuthSocialButton.module.css'

interface ButtonProps {
    fullwidth?: boolean,
    text?: string,
    onClick?: () => void,
    icon: string;
    style?: string;
}

const AuthSocialButton: React.FC<ButtonProps> = ({
    fullwidth, text, onClick, icon, style
}) => {
    return (
        <button type='button' onClick={onClick} className={`${styles['social-button']} ${style ? styles[style] : ''}`}>
            <img src={icon} />
            {text}
        </button>
    )
}

export default AuthSocialButton;