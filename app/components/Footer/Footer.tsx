import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <nav>
                <ul className={styles.navList}>
                    <li className={styles.navItem}><a href="/activities">Activities</a></li>
                    <li className={styles.navItem}><a href="/dashboard">Dashboard</a></li>
                    <li className={styles.navItem}><a href="/impressum">Impressum</a></li>
                    <li className={styles.navItem}><a href="/login">Login</a></li>
                    <li className={styles.navItem}><a href="/profile">Profile</a></li>
                    <li className={styles.navItem}><a href="/template">Template</a></li>
                </ul>
            </nav>
        </footer>
    );
};

export default Footer;
