import { Address } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash } from 'lucide-react';

interface AddressesProps {
  addresses: Address[];
}

export default function Addresses({ addresses }: AddressesProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">My Addresses</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>
      {addresses.length === 0 ? (
        <p className="text-muted-foreground">You haven't added any addresses yet.</p>
      ) : (
        addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{address.firstName} {address.lastName}</span>
                {address.isDefault && <Badge>Default</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>{address.city}, {address.state} {address.postalCode}</p>
              <p>{address.country}</p>
              {address.phone && <p>Phone: {address.phone}</p>}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}

