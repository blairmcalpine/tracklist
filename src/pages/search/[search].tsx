import ArtistTable from "@/components/ArtistTable";
import AuthBar from "@/components/AuthBar";
import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import SearchForm from "@/components/SearchForm";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const { query, isReady, push } = useRouter();
  const { data: sessionData } = useSession();
  const { data } = api.search.search.useQuery(query.search as string, {
    enabled:
      isReady && typeof query.search === "string" && Boolean(sessionData),
  });
  if (sessionData === null) {
    void push("/");
    return null;
  }
  return (
    <>
      <BackButton />
      <Container className="max-h-[100dvh] flex-col items-center gap-5 p-5">
        <SearchForm />
        <ArtistTable artists={data} expectedRows={20} />
      </Container>
      <AuthBar />
    </>
  );
}
