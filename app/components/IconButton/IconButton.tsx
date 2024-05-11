import styles from './IconButton.module.css'

interface ButtonProps {
    onClick?: () => void;
    icon: any;
    height?: number;
    width?: number
    danger?: boolean;
    href?: string;
    resize?: boolean;
    padding?: string
}

const IconButton: React.FC<ButtonProps> = ({ onClick, icon, height, width, danger, href, resize, padding }) => {
    return (
        <a href={href} style={{ padding: padding || '12px' }} onClick={onClick} className={`${styles["icon-button"]} ${danger ? styles['red'] : ''} ${resize ? styles['resize'] : ''}`}>
            <img alt='button-icon' src={icon} height={height} width={width} />
        </a>
    )
}

export default IconButton;