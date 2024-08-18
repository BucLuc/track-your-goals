'use client'

import styles from "./impressum.module.css";
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, getDocument } from '@services/firebaseService'
import Navbar from "@components/Navbar/Navbar";
import { useEffect, useState } from "react";
import IconAttribution from "@components/IconAttribution/IconAttribution";

const Impressum = () => {
  const [user, loading, error] = useAuthState(auth);
  const [photoURL, setPhotoURL] = useState('')

  useEffect(() => {
    if (!loading && user) {
      getDocument('users', user.uid)
        .then(doc => {
          if (doc) {
            setPhotoURL(doc?.photoURL)
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }, [user, loading]);
  return (
    <div>
      <Navbar user={user} photoURL={photoURL} />
      <div className={styles.container}>
        <h1>Verantwortliche Instanz:</h1>
        <div className={styles.infos}>
          <p>Luc Kneubühl</p>
          <p>Innerbergstrasse 38</p>
          <p>3044 Innerberg</p>
          <p>Schweiz</p>
        </div>
        <p><strong>E-Mail:</strong> buc.kneuluc@gmail.com</p>

        <h2>Haftungsausschluss</h2>
        <p>Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.</p>
        <p>Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.</p>

        <p>Alle Angebote sind freibleibend. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.</p>

        <h2>Haftungsausschluss für Inhalte und Links</h2>
        <p>Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des jeweiligen Nutzers.</p>

        <h2>Urheberrechtserklärung</h2>
        <p>Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Website, gehören ausschliesslich Luc Kneubühl oder den speziell genannten Rechteinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen.</p>

        <p><strong>Quelle:</strong> <a href="https://brainbox.swiss/" style={{ color: 'inherit', textDecoration: 'none' }}>BrainBox Solutions</a></p>
      </div>
      <h2 style={{marginLeft: '15%'}}>Attribution</h2>
      <div className={styles.attribution}>
          <IconAttribution icon="/img/Avatars/default-avatar.png" text="User icons created by Becris - Flaticon" href="https://www.flaticon.com/free-icons/user" />
          <IconAttribution icon="/img/Avatars/cat-avatar.png" text="Animals icons created by Freepik - Flaticon" href="https://www.flaticon.com/free-icons/animals" />
          <IconAttribution icon="/img/Avatars/panda-avatar.png" text="Panda icons created by Freepik - Flaticon" href="https://www.flaticon.com/free-icons/panda" />
          <IconAttribution icon="/img/Avatars/dog-avatar.png" text="Animals icons created by Freepik - Flaticon" href="https://www.flaticon.com/free-icons/animals" />
          <IconAttribution icon="/img/Avatars/man-avatar.png" text="Person icons created by Freepik - Flaticon" href="https://www.flaticon.com/free-icons/person" />
          <IconAttribution icon="/img/Avatars/woman-avatar.png" text="Person icons created by Freepik - Flaticon" href="https://www.flaticon.com/free-icons/person" />
          <IconAttribution icon="/img/Avatars/bear-avatar.png" text="Animal icons created by Freepik - Flaticon" href="https://www.flaticon.com/free-icons/animal" />
          <IconAttribution icon="/img/eye-open.png" text="Password icons created by th studio - Flaticon" href="https://www.flaticon.com/free-icons/password" />
          <IconAttribution icon="/img/eye-closed.png" text="Show password icons created by Stasy - Flaticon" href="https://www.flaticon.com/free-icons/show-password" />
          <IconAttribution icon="/img/verify-email-icon.png" text="Email icons created by FACH - Flaticon" href="https://www.flaticon.com/free-icons/email" />
          <IconAttribution icon="/img/google-icon.png" text="Google icons created by Freepik - Flaticon" href="https://www.flaticon.com/free-icons/google" />
          <IconAttribution icon="/img/github-icon.png" text="Github icons created by Pixel perfect - Flaticon" href="https://www.flaticon.com/free-icons/github" />
          <IconAttribution icon="/img/expander-right.png" text="Expand icons created by Google - Flaticon" href="https://www.flaticon.com/free-icons/expand" />
          <IconAttribution icon="/img/eraser-icon.png" text="Eraser icons created by Those Icons - Flaticon" href="https://www.flaticon.com/free-icons/eraser" />
          <IconAttribution icon="/img/add-icon.png" text="Plus icons created by srip - Flaticon" href="https://www.flaticon.com/free-icons/plus" />
          <IconAttribution icon="/img/arrow-down.png" text="Navigation icons created by Sikeystd - Flaticon" href="https://www.flaticon.com/free-icons/navigation" />
        </div>
    </div>
  );
};

export default Impressum;