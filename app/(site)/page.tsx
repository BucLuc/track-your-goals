import styles from "@/app/styles/page.module.css";
import { getCurrentUserAndDocument, logout } from "../services/firebaseService";
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getCurrentUserAndDocument()
  console.log(user)
  if (user === null){
    redirect('/login')
  }

  return (
    <div>
      <h1 className={styles.title}>Main Page</h1>
      {user && <div>
        <p>{user.displayName}</p>
        <button onClick={logout}>Logout</button>
      </div>}

    </div>
  );
}
