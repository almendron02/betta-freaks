export function SignOutButton({ className = "button button-outline" }: { className?: string }) {
  return (
    <form action="/auth/sign-out" method="post">
      <button className={className} type="submit">Sign out</button>
    </form>
  );
}
