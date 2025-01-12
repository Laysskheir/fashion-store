import { Suspense } from 'react'
import RolesPermissions from './_components/roles-permissions'
import { getRolesAndPermissions } from '@/lib/data'

export default async function RolesPermissionsPage() {
  const { roles, permissions, users } = await getRolesAndPermissions()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage user roles and their permissions</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <RolesPermissions initialRoles={roles} initialPermissions={permissions} users={users} />
      </Suspense>
    </div>
  )
}

