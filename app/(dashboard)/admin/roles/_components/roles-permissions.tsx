'use client'

import React, { useState } from 'react'
import { Shield, Plus, Pencil, Trash2, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Role, User } from '@prisma/client'

interface RolesPermissionsProps {
  initialRoles: Role[]
  initialPermissions: Permission[]
  users: User[]
}

export default function RolesPermissions({
  initialRoles,
  initialPermissions,
  users,
}: RolesPermissionsProps) {
  const [roles, setRoles] = useState(initialRoles)
  const [permissions] = useState(initialPermissions)
  const [searchTerm, setSearchTerm] = useState('')

  const handleCreateRole = (roleData: Omit<Role, 'id'>) => {
    const newRole = {
      ...roleData,
      id: (roles.length + 1).toString(),
    }
    setRoles([...roles, newRole])
  }

  const handleUpdateRole = (roleId: string, roleData: Omit<Role, 'id'>) => {
    setRoles(roles.map((role) => (role.id === roleId ? { ...role, ...roleData } : role)))
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId))
  }

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search roles..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <RoleDialog permissions={permissions} onSave={handleCreateRole} />
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>View and manage system roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{users.filter((user) => user.role === role.id).length}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Permissions
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {permissions.map((permission) => (
                          <DropdownMenuItem key={permission.id}>{permission.name}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <RoleDialog
                        role={role}
                        permissions={permissions}
                        onSave={(data) => handleUpdateRole(role.id, data)}
                      />
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={users.some((user) => user.role === role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>Available permissions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Module</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell>{permission.module}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

const RoleDialog: React.FC<{
  role?: Role
  permissions: Permission[]
  onSave: (role: Omit<Role, 'id'>) => void
}> = ({ role, permissions, onSave }) => {
  const [formData, setFormData] = useState({
    name: role?.name ?? '',
    description: role?.description ?? '',
    permissions: role?.permissions ?? [],
  })

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
        <DialogDescription>
          {role ? 'Modify the role details and permissions' : 'Define a new role and its permissions'}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 ">
        <div className="space-y-2">
          <Label htmlFor="name">Role Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter role name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter role description"
          />
        </div>
        <div className="space-y-4">
          <Label>Permissions</Label>
          <ScrollArea className="h-60 border rounded-md p-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={permission.id}
                  checked={formData.permissions.includes(permission.id)}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      permissions: checked
                        ? [...formData.permissions, permission.id]
                        : formData.permissions.filter((id) => id !== permission.id),
                    })
                  }}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor={permission.id}>{permission.name}</Label>
                  <p className="text-sm text-muted-foreground">{permission.description}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>

      <DialogFooter>
        <Button
          onClick={() => onSave(formData)}
          disabled={!formData.name || formData.permissions.length === 0}
        >
          {role ? 'Update Role' : 'Create Role'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

