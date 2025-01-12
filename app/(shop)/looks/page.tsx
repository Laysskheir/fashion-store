import LookCard from "./_components/look-card";
import { getLooks } from "./actions/get-looks";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LooksPage() {
  const looks = await getLooks();

  return (
    <div className="bg-background">
      <Container>
        <div className="space-y-10 pb-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Shop The Look</h1>
                <p className="mt-2 text-base text-muted-foreground">Browse our curated collection of complete outfits</p>
              </div>
              <div className="flex items-center gap-x-4">
                <span className="text-sm text-muted-foreground">{looks.length} Looks</span>
              </div>
            </div>
          </div>
          {looks.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No looks found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 px-4 sm:px-6 lg:px-8">
              {looks.map((look) => (
                <LookCard key={look.id} look={look} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
