'use client'

import styles from "./page.module.css";
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/app/services/firebaseService'
import Navbar from "@components/Navbar/Navbar";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div>
      <Navbar user={user}/>
      <a href='/dashboard'>Dashboard</a>
    </div>
  );
}
