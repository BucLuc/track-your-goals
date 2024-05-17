import styles from './Loading.module.css'

interface Props {
    size?: string;
    centered?: boolean;
}

const Loading: React.FC<Props> = ({size, centered}) =>  {
    return (
        <div className={`${styles["lds-ring"]} ${centered ? styles.centered : ''}`} style={{width: size ? size : '64px', height: size ? size : '64px'}}><div></div><div></div><div></div><div></div></div>
    )
}

export default Loading;