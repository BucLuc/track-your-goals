import styles from './IconAttribution.module.css'

interface Props {
    icon: string;
    href: string;
    text: string
}

const IconAttribution: React.FC<Props> = ({icon, href, text }) => {
    return (
        <a href={href} className={styles.container}>
            <div className={styles['img-container']}>
                <img src={icon} alt={text} />
            </div>
            {text}
        </a>
    )
}

export default IconAttribution;