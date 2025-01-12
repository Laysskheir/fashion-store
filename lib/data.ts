import { cache } from 'react'
import { db } from './db'


export const getRolesAndPermissions = cache(async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  const roles = [
    { id: 'ADMIN', name: 'Admin', description: 'Full system access' },
    { id: 'CUSTOMER', name: 'Customer', description: 'Basic user access' },
  ]

  const permissions = [
    { id: '1', name: 'user.view', description: 'View user details', module: 'Users' },
    { id: '2', name: 'user.create', description: 'Create new users', module: 'Users' },
    { id: '3', name: 'user.edit', description: 'Edit user details', module: 'Users' },
    { id: '4', name: 'role.manage', description: 'Manage roles and permissions', module: 'Roles' },
    { id: '5', name: 'order.view', description: 'View order details', module: 'Orders' },
    { id: '6', name: 'order.manage', description: 'Manage orders', module: 'Orders' },
  ]

  return { users, roles, permissions }
})
