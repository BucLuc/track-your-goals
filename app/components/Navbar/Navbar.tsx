import styles from './Navbar.module.css'
import { useState } from 'react';
import {auth} from '@/app/services/firebaseService'
import { signOut, User } from 'firebase/auth';

 
interface NavbarProps {
    activeLink?: "DASHBOARD" | "TEMPLATE" | "ACTIVITIES" | undefined ;
    user?: User | null ;
    photoURL?: string ;
}
 
const Navbar: React.FC<NavbarProps> = ({ activeLink, user, photoURL }) => {
    const [isHovering, setIsHovering] = useState(false);

    const actualURL = photoURL ? photoURL : user && user.photoURL ? user.photoURL : "/img/Avatars/default-avatar.png";

    return (
    <nav className={styles.nav}>
        <div className={styles["nav-content"]}>
            <div className={styles.logo}>
                <a href='/'>
                <img alt="logo" src="/img/logo-icon.png"/>
                <img alt="logo-text" src='/img/logo-text.png' />
                </a>
            </div>
            <ul>
                <li className={activeLink === "DASHBOARD" ? styles.active : ""}><a href='/dashboard'>Dashboard</a></li>
                <li className={activeLink === "ACTIVITIES" ? styles.active : ""}><a href='/activities'>Aktivitäten</a></li>
                <li className={activeLink === "TEMPLATE" ? styles.active : ""}><a href='/template'>Wochenvorlage</a></li>
            </ul>
            <div className={styles.user}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}>
                    <div className={styles['img-container']}>
                        <a href='/profile'><img alt="userIcon" src={actualURL}/></a>
                    </div>   
                {isHovering && (
                    <div className={styles.menu}>
                        {user && <a href='/dashboard'>Dashboard</a>}
                        {user && <a href='/profile'>Profil</a>}
                        {user && <a href="#" onClick={() => signOut(auth)} className={styles['sign-out']}>Abmelden</a>}
                        {!user && <a href="/login">Anmelden</a>}
                    </div>
                )}
            </div>
        </div>
    </nav>
    );
};

export default Navbar