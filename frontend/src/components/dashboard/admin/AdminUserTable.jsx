"use client";
import { useState } from "react";
import { fetchAPI } from "@/lib/api";
import RoleBadge from "@/components/common/RoleBadge";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import {
    Users,
    Search,
    Edit,
    UserCheck,
    UserX,
    Trash2,
    Calendar,
    Sparkles,
    CheckCircle2
} from "lucide-react";


const AdminUserTable = ({
    users,
    roles,
    currentAdmin,
    token,
    onUserUpdated,
    onUserDeleted,
}) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    // Role Assignment Modal
    const [editingUser, setEditingUser] = useState(null);
    const [selectedNewRole, setSelectedNewRole] = useState("");
    const [savingRole, setSavingRole] = useState(false);
    // Deletion Modal
    const [deleteTargetUser, setDeleteTargetUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(false);
    // 1. Submit Role Change
    const handleUpdateRole = async () => {
        if (!editingUser || !selectedNewRole) return;
        setSavingRole(true);
        try {
            const targetRoleId = Number(selectedNewRole) || selectedNewRole;
            await fetchAPI(`/users/${editingUser.id}`, {
                method: "PUT",
                token,
                body: { role: targetRoleId },
            });
            const matchedRole = roles.find((r) => String(r.id) === String(targetRoleId));
            onUserUpdated(editingUser.id, { role: matchedRole || { name: "Updated" } });
            setEditingUser(null);
        } catch (err) {
            console.error("Failed to update role:", err);
            alert(err?.message || "Failed to update user role.");
        } finally {
            setSavingRole(false);
        }
    };
    // 2. Toggle Account Suspension
    const handleToggleBlock = async (targetUser) => {
        try {
            const newBlockedState = !targetUser.blocked;
            await fetchAPI(`/users/${targetUser.id}`, {
                method: "PUT",
                token,
                body: { blocked: newBlockedState },
            });
            onUserUpdated(targetUser.id, { blocked: newBlockedState });
        } catch (err) {
            console.error("Failed to toggle status:", err);
            alert(err?.message || "Failed to update user status.");
        }
    };
    // 3. Confirm Deletion
    const handleDeleteUser = async () => {
        if (!deleteTargetUser) return;
        setDeletingUser(true);
        try {
            await fetchAPI(`/users/${deleteTargetUser.id}`, {
                method: "DELETE",
                token,
            });
            onUserDeleted(deleteTargetUser.id);
            setDeleteTargetUser(null);
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert(err?.message || "Failed to delete user.");
        } finally {
            setDeletingUser(false);
        }
    };
    // Filtered dataset
    const filteredUsers = users.filter((u) => {
        const name = (u.username || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const roleName = (u.role?.name || u.role?.type || "Student").toLowerCase();
        const matchesSearch = name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "All" || roleName.includes(roleFilter.toLowerCase());
        return matchesSearch && matchesRole;
    });


    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header with Search & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-500" /> Platform User Directory & RBAC Roles
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Assign roles, promote users, and regulate account access status.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search username or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-amber-500 transition"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition"
                    >
                        <option value="All">All Roles</option>
                        <option value="Student">Students</option>
                        <option value="Instructor">Instructors</option>
                        <option value="Manager">Content Managers</option>
                        <option value="Admin">Admins</option>
                    </select>
                </div>
            </div>
            {/* Users Table */}
            {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                            <tr>
                                <th className="pb-3 pl-2">User Profile</th>
                                <th className="pb-3">Assigned Role</th>
                                <th className="pb-3">Account Status</th>
                                <th className="pb-3">Registered Date</th>
                                <th className="pb-3 pr-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredUsers.map((u) => {
                                const roleName = u.role?.name || u.role?.type || "Student";
                                const isSelf = u.id === currentAdmin?.id;
                                return (
                                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                        <td className="py-4 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                                    {u.username ? u.username.slice(0, 2).toUpperCase() : "US"}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{u.username}</p>
                                                        {isSelf && (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <RoleBadge role={roleName} />
                                        </td>
                                        <td className="py-4">
                                            {u.blocked ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800">
                                                    <UserX className="w-3 h-3" /> Suspended
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                    <UserCheck className="w-3 h-3" /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 text-slate-500 font-medium">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-2 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(u);
                                                        setSelectedNewRole(u.role?.id || "");
                                                    }}
                                                    title="Assign / Promote Role"
                                                    className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {!isSelf && (
                                                    <button
                                                        onClick={() => handleToggleBlock(u)}
                                                        title={u.blocked ? "Unblock Account" : "Suspend Account"}
                                                        className={`p-2 rounded-xl transition ${u.blocked
                                                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                                                                : "text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                                                            }`}
                                                    >
                                                        {u.blocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                                    </button>
                                                )}
                                                {!isSelf && (
                                                    <button
                                                        onClick={() => setDeleteTargetUser(u)}
                                                        title="Delete Account"
                                                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState
                    icon={Users}
                    title="No Users Match Search"
                    description="Try adjusting your search keywords or role filter."
                />
            )}
            {/* Role Assignment Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign User Role</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Update permissions for <span className="font-bold">{editingUser.username}</span>
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Platform Role</label>
                            {roles.length > 0 ? (
                                <div className="space-y-2">
                                    {roles.map((r) => {
                                        const isSelected = String(selectedNewRole) === String(r.id);
                                        return (
                                            <label
                                                key={r.id}
                                                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${isSelected
                                                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-slate-900 dark:text-white font-bold"
                                                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="roleSelection"
                                                        value={r.id}
                                                        checked={isSelected}
                                                        onChange={() => setSelectedNewRole(r.id)}
                                                        className="text-amber-600 focus:ring-amber-500"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-bold">{r.name}</p>
                                                        <p className="text-[11px] text-slate-400 font-normal">{r.description || `Platform ${r.name}`}</p>
                                                    </div>
                                                </div>
                                                <RoleBadge role={r.name} size="sm" />
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : (
                                <select
                                    value={selectedNewRole}
                                    onChange={(e) => setSelectedNewRole(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-none font-semibold"
                                >
                                    <option value="">Choose a role...</option>
                                    <option value="Student">Student</option>
                                    <option value="Instructor">Instructor</option>
                                    <option value="Content Manager">Content Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                disabled={savingRole}
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={savingRole || !selectedNewRole}
                                onClick={handleUpdateRole}
                                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{savingRole ? "Updating..." : "Save Role"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Deletion Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={Boolean(deleteTargetUser)}
                title="Delete User Account?"
                message={`Are you sure you want to permanently delete "${deleteTargetUser?.username}"? This will revoke platform access.`}
                onClose={() => setDeleteTargetUser(null)}
                onConfirm={handleDeleteUser}
                loading={deletingUser}
            />
        </div>
    );
};

export default AdminUserTable;