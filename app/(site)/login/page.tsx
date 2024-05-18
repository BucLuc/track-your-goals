import AuthForm from "@/app/components/Auth/AuthForm/AuthForm";
import styles from "./login.module.css";
import Image from "next/image"

export default function Login() {
  return (
    <div className={styles["page-container"]}>
      <div className={styles['form-container']}>
        <AuthForm />
      </div>
    </div>
  );
}
