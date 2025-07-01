// import { redirect } from "next/navigation";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login");
}
