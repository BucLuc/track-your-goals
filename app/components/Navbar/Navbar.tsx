import styles from './Navbar.module.css'
import Image from "next/image"
import { useState } from 'react';
import {auth} from '@/app/services/firebaseService'
import { signOut, User } from 'firebase/auth';

 
interface NavbarProps {
    activeLink?: "HOME" | "TEMPLATE" | "ACTIVITIES" | undefined ;
    user?: User | null ;
}
 
const Navbar: React.FC<NavbarProps> = ({ activeLink, user }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
    <nav className={styles.nav}>
        <div className={styles["nav-content"]}>
            <div className={styles.logo}>
                <a href='/'>
                <Image alt="logo" src="/img/logo-icon.png" width={50} height={50}/>
                <img alt="logo-text" src='/img/logo-text.png' />
                </a>
            </div>
            <ul>
                <li className={activeLink === "HOME" ? styles.active : ""}><a href='/dashboard'>Home</a></li>
                <li className={activeLink === "TEMPLATE" ? styles.active : ""}><a href='/template'>Wochenvorlage</a></li>
                <li className={activeLink === "ACTIVITIES" ? styles.active : ""}><a href='activities'>Aktivitäten</a></li>
            </ul>
            <div className={styles.user}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}>
                    <div className={styles['img-container']}>
                        <img alt="userIcon" src={user && user.photoURL ? user.photoURL : "/img/user-icon.png"} width={50} height={50}/>
                    </div>   
                {isHovering && (
                    <div className={styles.menu}>
                        {user && <a href="#" onClick={() => signOut(auth)}>Abmelden</a>}
                        {!user && <a href="/login">Anmelden</a>}
                    </div>
                )}
            </div>
        </div>
    </nav>
    );
};

export default Navbar