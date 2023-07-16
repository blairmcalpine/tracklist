import AuthBar from "@/components/AuthBar";
import Container from "@/components/Container";
import SearchForm from "@/components/SearchForm";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: sessionData } = useSession();

  if (sessionData === null) {
    return <SignIn />;
  }

  return (
    <>
      <AuthBar />
      <Container className="items-center justify-center">
        <SearchForm />
      </Container>
    </>
  );
}

function SignIn() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        className="rounded-full bg-green px-4 py-3 text-lg text-black transition-transform hover:scale-105"
        onClick={() => void signIn("spotify")}
      >
        Sign In With Spotify
      </button>
    </div>
  );
}
