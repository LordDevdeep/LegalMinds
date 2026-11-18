import { redirect } from "next/navigation";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const destination = searchParams.redirect || "/analyzer";
  redirect(`/auth/login?redirect=${encodeURIComponent(destination)}`);
}
