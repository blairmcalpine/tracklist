import AuthBar from "@/components/AuthBar";
import Container from "@/components/Container";
import SearchForm from "@/components/SearchForm";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return <SignIn />;
  }

  return (
    <>
      <AuthBar />
      <Container className="items-center justify-center overflow-y-hidden px-3 md:overflow-y-auto">
        <SearchForm />
      </Container>
    </>
  );
}

function SignIn() {
  return (
    <Container className="items-center justify-center px-3">
      <button
        className="rounded-full bg-green px-4 py-3 text-lg text-black transition-transform hover:scale-105"
        onClick={() => void signIn("spotify")}
      >
        Sign In With Spotify
      </button>
    </Container>
  );
}
