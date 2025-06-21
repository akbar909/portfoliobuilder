"use client";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function EditUserModal({ user, open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    role: user?.role || "user",
    verified: user?.verified || false,
  });
  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      role: user?.role || "user",
      verified: user?.verified || false,
    });
  }, [user]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white  dark:bg-background dark:text-foreground rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              className="dark:bg-background dark:text-foreground w-full border rounded px-3 py-2"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="Full name"
              title="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-email">Email</label>
            <input
              id="edit-email"
              className="dark:bg-background dark:text-foreground w-full border rounded px-3 py-2"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              placeholder="Email address"
              title="Email address"
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-username">Username</label>
            <input
              id="edit-username"
              className="dark:bg-background dark:text-foreground w-full border rounded px-3 py-2"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              placeholder="Username"
              title="Username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-role">Role</label>
            <select
              id="edit-role"
              className="dark:bg-background dark:text-foreground w-full border rounded px-3 py-2"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              title="Role"
            >
              <option value="user">User</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-verified">Verified</label>
            <select
              id="edit-verified"
              className="dark:bg-background dark:text-foreground w-full border rounded px-3 py-2"
              value={form.verified ? "true" : "false"}
              onChange={e => setForm(f => ({ ...f, verified: e.target.value === "true" }))}
              title="Verified"
            >
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SuperadminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setError("Unauthorized");
      setLoading(false);
      return;
    }
    // @ts-ignore
    if (session.user.role !== "superadmin") {
      setError("Forbidden: Superadmin access only");
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [session, status]);
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user and their portfolio?")) return;
    setActionLoading(true);
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    fetchUsers();
    setActionLoading(false);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleEditSave = async (form) => {
    setActionLoading(true);
    await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: editUser._id, ...form }),
    });
    setEditOpen(false);
    setEditUser(null);
    fetchUsers();
    setActionLoading(false);
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Superadmin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg bg-card shadow-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Verified</th>
              <th className="p-3 text-left">Portfolio</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-muted/50">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  {user.verified ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </td>
                <td className="p-3">
                  {user.portfolio ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(user)} disabled={actionLoading}>Edit</Button>
                  {user.role !== "superadmin" && (
                    <Button size="sm" className="bg-red-700 hover:bg-red-800 dark:text-white" onClick={() => handleDelete(user._id)} disabled={actionLoading}>Delete</Button>
                  )}
                  <Button size="sm" onClick={() => window.open(`/${user.username}`, '_blank')} disabled={actionLoading}>View Portfolio</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
            className="cursor-pointer"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink className="cursor-pointer"
                isActive={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
            className="cursor-pointer"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <EditUserModal
        user={editUser}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
      />
    </div>
  );
}