import AuthForm from "@/app/components/Auth/AuthForm/AuthForm";
import styles from "@/app/styles/login.module.css";
import Image from "next/image"

export default function Login() {
  return (
    <div className={styles["page-container"]}>
      <Image height="96" width="96" src="/img/logo-icon.png" alt="logo-icon" />
      <h2>Sign in to your Account</h2>
      <AuthForm />
    </div>
  );
}
