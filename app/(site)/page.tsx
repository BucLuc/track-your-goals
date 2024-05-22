'use client'

import styles from "./page.module.css";
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth, getDocument} from '@services/firebaseService'
import Navbar from "@components/Navbar/Navbar";
import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [photoURL, setPhotoURL] = useState('')

  useEffect(() => {
    if (!loading && user) {
        getDocument('users', user.uid)
            .then(doc => {
              if (doc){
                setPhotoURL(doc?.photoURL)
              } 
            })
            .catch(err => {
                console.error(err)
            })
    }
}, [user, loading]);


  return (
    <div className={styles.container}>
      <Navbar user={user} photoURL={photoURL}/>
      <div className={styles['hero-section']}>
        <div className={styles['hero-content']}>
            <h1>Track Your Goals</h1>
            <p>Kostenlos, einfach, effektiv - Dein persönlicher Wegbegleiter für tägliche Ziele und wöchentliche Erfolge.</p>
            <div className={styles['link-section']}>
              <a href="/login" className={styles['main-link']}>Anmelden</a>
              <a href="#infos">Mehr erfahren</a>
            </div>
          </div>
      </div>
      <div className={styles.infos} id="infos">
        <div className={styles.info}>
            <div className={styles.content}>
              <h2>Deine Aktivitäten, Deine Regeln</h2>
              <p>Beginne mit &quot;Track Your Goals&quot; deine persönlichen Aktivitäten festzulegen. Ob Fitness, Lernen oder Meditation - plane deine Tagesziele nach deinen eigenen Vorstellungen. Alles in einer intuitiven und benutzerfreundlichen Oberfläche.</p>
            </div>
            <div className={styles['img-section']}>
                <img alt="activities" src="/img/activities.gif" />
            </div>
            <div className={styles.arrow}>
              <img alt="pfeil" src="img/arrow-drawn.png" />
            </div>
        </div>
        <div className={styles.info}>
            <div className={styles['img-section']}>
                <img alt="activities" src="/img/template.gif" className={styles['left-image']}/>
            </div>
            <div className={styles.content}>
              <h2>Vorlagen für tägliche Routine</h2>
              <p>Erstelle Vorlagen, die deinen Alltag strukturieren. Wähle aus, welche Aktivitäten du an welchen Tagen durchführen möchtest, und passe deine Pläne flexibel an. Unsere Vorlagen helfen dir dabei, eine konstante Routine zu entwickeln, welche dich motiviert und auf Kurs hält.</p>
            </div>
            <div className={styles['left-arrow']}>
              <img alt="pfeil" src="img/arrow-drawn.png" />
            </div>
        </div>
        <div className={styles.info}>
            <div className={styles.content}>
              <h2>Plane und verfolge deine Wochen - Flexibel und effektiv</h2>
              <p>Starten neue Woche mit einer klaren Struktur. Lade deine individuell erstellte Wochenvorlage und passe die geplanten Aktivitäten nach Bedarf an, bevor deine Woche beginnt. Diese Flexibilität ermöglicht es dir, auf unvorhergesehene Änderungen reagieren zu können und deine wöchentlichen Ziele stets im Auge zu behalten. Plane voraus und maximiere deine Effizienz, Woche für Woche.</p>
            </div>
            <div className={styles['img-section']}>
                <img alt="activities" src="/img/plan-week.gif" />
            </div>
        </div>
      </div>
      <div className={styles['end-part']}>
        <h2>Erreiche deine Ziele noch Heute</h2>
        <p>Tracke deine Aktivitäten, bleib motiviert und erreiche deine Ziele</p>
        <div className={styles['link-section']}>
              <a href="/login" className={styles['main-link']}>Anmelden</a>
              <a href="#infos">Mehr erfahren</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
