import Image from "next/image";
import Link from "next/link";
import { Look } from "@prisma/client";

interface LookCardProps {
  look: Look;
}

const LookCard = ({ look }: LookCardProps) => {
  return (
    <Link href={`/looks/${look.id}`} className="group">
      <div className="aspect-[3/4] relative w-full overflow-hidden bg-muted">
        <Image
          src={look.image}
          alt={look.name}
          fill
          className="object-cover object-center transition duration-300 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-background opacity-0 transition-opacity group-hover:opacity-10 backdrop-blur-sm" />
        <div className="absolute inset-0  bg-opacity-50 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
          <span className="text-primary text-lg font-bold px-4 py-2 capitalize">{look.name}</span>
        </div>
      </div>
    </Link>
  );
};

export default LookCard;
