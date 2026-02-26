import { redirect } from "next/navigation";

export default function AdminLoginRedirectPage() {
  redirect("/api/auth/signin?callbackUrl=/admin");
}

