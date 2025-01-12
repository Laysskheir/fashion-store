import { notFound } from "next/navigation";
import { getLook } from "../actions/get-look";
import { Container } from "@/components/ui/container";
import LookDetails from "./_components/look-details";

interface LookPageProps {
  params: {
    lookId: string;
  };
}

export default async function LookPage({ params }: LookPageProps) {
  const look = await getLook(params.lookId);

  if (!look) {
    return notFound();
  }

  return (
    <Container>
        <LookDetails look={look} />
    </Container>
  );
}
