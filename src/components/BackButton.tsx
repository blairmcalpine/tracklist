import { useRouter } from "next/router";

export default function BackButton() {
  const { back } = useRouter();
  return (
    <button onClick={back} className="fixed left-5 top-8" title="Go Back">
      <svg viewBox="0 0 16 16" fill="white" className="h-6 w-6">
        <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
      </svg>
    </button>
  );
}
