"use client"

import { deleteUser, updateUserRole } from "@/app/actions/userActions"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ExternalLink, Loader2, Shield, ShieldAlert, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"

interface User {
    _id: string
    name: string
    email: string
    username: string
    role: "user" | "superadmin"
    createdAt: string
    image?: string
}

const ITEMS_PER_PAGE = 5

export function UserManagementTable({ users }: { users: User[] }) {
    const [isPending, startTransition] = useTransition()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")

    // Dialog States
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [roleConfirm, setRoleConfirm] = useState<{ id: string, role: "user" | "superadmin" } | null>(null)

    // Filter Users
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handleDelete = async () => {
        if (!deleteConfirm) return
        const userId = deleteConfirm

        startTransition(async () => {
            const result = await deleteUser(userId)
            if (!result.success) {
                alert("Failed to delete user")
            }
            setDeleteConfirm(null)
            // Adjust page if empty after delete
            if (paginatedUsers.length === 1 && currentPage > 1) {
                setCurrentPage(p => p - 1)
            }
        })
    }

    const handleRoleUpdate = async () => {
        if (!roleConfirm) return
        const { id, role } = roleConfirm
        const newRole = role === "user" ? "superadmin" : "user"

        startTransition(async () => {
            const result = await updateUserRole(id, newRole)
            if (!result.success) {
                alert("Failed to update user role")
            }
            setRoleConfirm(null)
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search by name, email, or username..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="py-2">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                        <span className="text-xs text-muted-foreground">@{user.username}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-2">
                                    <Badge
                                        variant={user.role === "superadmin" ? "default" : "secondary"}
                                        className="cursor-pointer hover:opacity-80"
                                        onClick={() => setRoleConfirm({ id: user._id, role: user.role })}
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-2 text-xs">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right py-2">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild title="View Portfolio">
                                            <Link href={`/${user.username}`} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            title="Toggle Role"
                                            disabled={isPending}
                                            onClick={() => setRoleConfirm({ id: user._id, role: user.role })}
                                        >
                                            {user.role === 'superadmin' ? (
                                                <ShieldAlert className="h-4 w-4 text-orange-500" />
                                            ) : (
                                                <Shield className="h-4 w-4" />
                                            )}
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            title="Delete User"
                                            disabled={isPending}
                                            onClick={() => setDeleteConfirm(user._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(p => p - 1) }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === i + 1}
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(p => p + 1) }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account and their portfolio data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Role Update Confirmation Dialog */}
            <AlertDialog open={!!roleConfirm} onOpenChange={(open) => !open && setRoleConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change User Role</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change this user's role to <strong>{roleConfirm?.role === 'user' ? 'Superadmin' : 'User'}</strong>?
                            {roleConfirm?.role === 'user' && " They will gain full access to the administration dashboard."}
                            {roleConfirm?.role === 'superadmin' && " They will lose access to the administration dashboard."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRoleUpdate}>
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
