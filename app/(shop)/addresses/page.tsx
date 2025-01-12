import { Container } from "@/components/ui/container";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAddresses } from "./_actions/address-actions";
import { AddressList } from "./_components/address-list";

export default async function AddressesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  const addresses = await getAddresses(session.user.id);

  return (
    <Container>
      <div className="py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <p className="text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <AddressList initialAddresses={addresses} userId={session.user.id} />
      </div>
    </Container>
  );
}
