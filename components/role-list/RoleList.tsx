"use client"

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRoleListPaginated,
  editNationalDistributor,
  deactivateNationalDistributor,
  deleteNationalDistributor,
  editSS,
  editDB,
  editRetailer,
  editParent,
  editAdmin,
  api,
  resetPasswordForUser,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { MoreHorizontal, Edit, Trash2, CheckCircle, Slash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RoleKey = "admin" |"nd" | "ss" | "db" | "retailer" | string;

// Debounce hook
function useDebounce<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

type Props = {
  role: RoleKey;
};

export default function RoleList({ role }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [status, setStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [entries, setEntries] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(() => {
    const f: Record<string, string | undefined> = {};
    if (debouncedSearch?.trim()) f.search = debouncedSearch.trim();
    if (status && status !== "all") f.status = status;
    if (startDate) f.startDate = startDate;
    if (endDate) f.endDate = endDate;
    return f;
  }, [debouncedSearch, status, startDate, endDate]);

  useEffect(() => {
    // reset page when filters change
    setPage(1);
  }, [debouncedSearch, status, startDate, endDate, password]);

  // fetchList extracted so actions can refresh the table after mutations
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getRoleListPaginated(role as any, page, limit, filters);
      setEntries(res.entries || []);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to load list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [role, page, limit, filters]);

  // Actions dialog state
  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<any | null>(null);
  const [actionInFlight, setActionInFlight] = useState(false);

  // Change password dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<any | null>(null);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordWorking, setPasswordWorking] = useState(false);
  const [passwordSuccessOpen, setPasswordSuccessOpen] = useState(false);
  const [savedPassword, setSavedPassword] = useState("");

  // Inline edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState<any>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const validateEdit = (values: any) => {
    const errs: Record<string, string> = {};
    if (!values.companyName || !values.companyName.trim()) errs.companyName = "Company name is required";
    if (!values.email || !values.email.trim()) errs.email = "Email is required";
    else {
      // simple email regex
      const re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
      if (!re.test(values.email)) errs.email = "Enter a valid email";
    }
    if (!values.phone || !values.phone.trim()) errs.phone = "Phone is required";
    // Address is required (was previously called 'location')
    if (!values.address || !values.address.trim()) errs.address = "Address is required";
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openEdit = (entry: any) => {
    setEditValues({
      id: entry._id || entry.id,
      name: entry.name,
      companyName: entry.companyName ?? entry.name,
      location: entry.location ?? "",
      address: entry.address ?? entry.addressLine ?? "",
      email: entry.email,
      phone: entry.phone,
      status: entry.status,
      keysAssigned: entry.keysAssigned ?? entry.assignedKeys ?? entry.transferredKeys ?? 0,
    });
    setEditOpen(true);
    setEditErrors({});
  };

  const handleSaveEdit = async () => {
    const id = editValues.id;
    if (!id) return;
    // validate before saving
    if (!validateEdit(editValues)) return;
    setActionInFlight(true);
    try {
      // send only allowed fields
      const payload: any = {
        name: editValues.name,
        companyName: editValues.companyName,
        address: editValues.address,
        email: editValues.email,
        phone: editValues.phone,
        status: editValues.status,
      };
      // Call role-specific edit endpoint
      if (role === 'nd') {
        await editNationalDistributor(id, payload);
      } else if (role === 'ss') {
        await editSS(id, payload);
      } else if (role === 'db') {
        await editDB(id, payload);
      } else if (role === 'retailer') {
        await editRetailer(id, payload);
      } else if (role === 'parent') {
        await editParent(id, payload);
      } else if (role === 'admin') {
        await editAdmin(id, payload);
      } else {
        // fallback to ND edit
        await editNationalDistributor(id, payload);
      }
      toast.success("Saved");
      setEditOpen(false);
      setEditErrors({});
      await fetchList();
    } catch (err: any) {
      console.error(err);
      // Try to map server-side field errors into editErrors for inline display
      const apiErrors: Record<string, string> | undefined = err?.response?.data?.errors || err?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        setEditErrors(apiErrors as Record<string, string>);
      } else {
        toast.error(err?.message || "Save failed");
      }
    } finally {
      setActionInFlight(false);
    }
  };

  const openAction = (type: string, entry: any) => {
    setActionType(type);
    setActionTarget(entry);
    setActionOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!actionType || !actionTarget) return;
    setActionInFlight(true);
    try {
      const id = actionTarget._id || actionTarget.id;
      if (actionType === "activate") {
        const payload = { status: 'active' };
        if (role === 'nd') {
          await editNationalDistributor(id, payload as any);
        } else if (role === 'ss') {
          await editSS(id, payload);
        } else if (role === 'db') {
          await editDB(id, payload);
        } else if (role === 'retailer') {
          await editRetailer(id, payload);
        } else if (role === 'parent') {
          await editParent(id, payload);
        } else if (role === 'admin') {
          await editAdmin(id, payload);
        } else {
          await editNationalDistributor(id, payload as any);
        }
        toast.success("Activated successfully");
      } else if (actionType === "deactivate") {
        if (role === 'nd') {
          await deactivateNationalDistributor(id);
        } else {
          const payload = { status: 'inactive' };
          if (role === 'ss') await editSS(id, payload);
          else if (role === 'db') await editDB(id, payload);
          else if (role === 'retailer') await editRetailer(id, payload);
          else if (role === 'parent') await editParent(id, payload);
          else if (role === 'admin') await editAdmin(id, payload);
          else await editNationalDistributor(id, payload as any);
        }
        toast.success("Deactivated successfully");
      } else if (actionType === "delete") {
        if (role === 'nd') {
          await deleteNationalDistributor(id);
        } else {
          // Generic delete for other roles
          await api.delete(`/admin/${role}/${id}`);
        }
        toast.success("Deleted successfully");
      } else if (actionType === "edit") {
        // open inline edit modal instead of navigation
        openEdit(actionTarget);
      }

      // refresh list after action (except when opening edit modal)
      if (actionType !== "edit") await fetchList();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Action failed");
    } finally {
      setActionOpen(false);
      setActionType(null);
      setActionTarget(null);
      setActionInFlight(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue shadow-sm">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </span>
            {role.toUpperCase()} List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-4">
            <Input
              placeholder="Search by name, username, email..."
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
              className="max-w-sm"
            />

            <Select onValueChange={(val) => setStatus(val)} value={status}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-2 py-1 border rounded" />
              <span className="text-gray-400">to</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-2 py-1 border rounded" />
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setSearch("");
                setStatus("all");
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear
            </Button>
          </div>

          {loading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : (
            <div className="rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border p-2">
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Name</th>
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Username</th>
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Email</th>
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Phone</th>
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Transferred</th>
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Received</th>
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Address</th>
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Status</th>
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                      <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr key={e.id || e._id} className="hover:bg-gradient-to-r hover:from-electric-purple/5 hover:to-electric-blue/5 transition-colors" >
                        <td className="p-3 font-medium text-gray-900 dark:text-gray-100 cursor-pointer" onClick={() => router.push(`/roles/${role}`)}>{e.name}</td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">{e.username}</td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">{e.email}</td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">{e.phone}</td>
                        <td className="p-3 text-gray-900 dark:text-gray-100">{e.transferredKeys ?? "-"}</td>
                        <td className="p-3 text-gray-900 dark:text-gray-100">{e.receivedKeys ?? "-"}</td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">{e.address ?? e.addressLine ?? e.location ?? "-"}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                e.status === "active"
                  ? "bg-green-700 text-white"
                  : e.status === "inactive"
                  ? "bg-gray-600 text-white"
                  : "bg-red-600 text-white"
                            }`}
                          >
                            {e.status?.toString()?.toUpperCase() ?? "N/A"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button disabled={actionInFlight} className="p-2 rounded-full hover:bg-accent/50" aria-label="Actions">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => openAction("edit", e)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              {e.status === "active" ? (
                                <DropdownMenuItem onSelect={() => openAction("deactivate", e)}>
                                  <Slash className="mr-2 h-4 w-4" /> Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onSelect={() => openAction("activate", e)}>
                                  <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onSelect={() => openAction("delete", e)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => { setPasswordTarget(e); setPasswordDialogOpen(true); }}>
                                <Slash className="mr-2 h-4 w-4" /> Change Password
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="p-3 text-gray-600">{new Date(e.joinedDate || e.createdAt || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" className="rounded-full px-6 py-2" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </Button>
            <div className="text-sm font-medium text-gray-700">Page {page} of {totalPages}</div>
            <Button variant="outline" className="rounded-full px-6 py-2" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* generic confirm dialog for activate/deactivate/delete (delete shows danger) */}
      <Dialog open={actionOpen} onOpenChange={(v) => setActionOpen(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType ? actionType.charAt(0).toUpperCase() + actionType.slice(1) : "Confirm"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType} {actionTarget?.name ?? "this item"}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setActionOpen(false)} disabled={actionInFlight}>Cancel</Button>
              <Button onClick={handleConfirmAction} disabled={actionInFlight} className={actionType === "delete" ? "bg-red-600 hover:bg-red-700 text-white" : ""}>
                {actionInFlight ? "Working..." : "Confirm"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password change dialog */}
  <Dialog open={passwordDialogOpen} onOpenChange={(v) => { if (!v) { setPasswordValue(""); setPasswordTarget(null); } setPasswordDialogOpen(v); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Set a new password for {passwordTarget?.name ?? "this user"}.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium">New password</label>
              <Input value={passwordValue} onChange={(e) => setPasswordValue((e.target as HTMLInputElement).value)} placeholder="Enter a new password" />
            </div>
            {/* No generated password UI — admin must type the password manually */}
          </div>
          <DialogFooter>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setPasswordDialogOpen(false)} disabled={passwordWorking}>Cancel</Button>
              <Button onClick={async () => {
                if (!passwordTarget) return;
                setPasswordWorking(true);
                // require admin to type password
                if (!passwordValue || !passwordValue.trim()) {
                  toast.error('Please type a new password');
                  setPasswordWorking(false);
                  return;
                }
                try {
                  const id = passwordTarget._id || passwordTarget.id;
                  if (!id) throw new Error('Missing id');
                  // call role-appropriate edit endpoint with password
                  const payload = { password: passwordValue };
                  if (role === 'nd') {
                    await editNationalDistributor(id, payload as any);
                  } else if (role === 'ss') {
                    await editSS(id, payload);
                  } else if (role === 'db') {
                    await editDB(id, payload);
                  } else if (role === 'retailer') {
                    await editRetailer(id, payload);
                  } else if (role === 'parent') {
                    await editParent(id, payload);
                  } else {
                    // fallback to generic edit endpoint
                    await editNationalDistributor(id, payload as any);
                  }
                  // Keep the entered password visible once for the admin to copy
                  setSavedPassword(passwordValue);
                  setPasswordDialogOpen(false);
                  setPasswordSuccessOpen(true);
                  await fetchList();
                } catch (err: any) {
                  console.error(err);
                  toast.error(err?.response?.data?.message || err?.message || 'Failed to change password');
                } finally {
                  setPasswordWorking(false);
                }
                }} className="bg-gradient-to-r from-electric-purple to-electric-blue text-white" disabled={passwordWorking}>
                {passwordWorking ? 'Working...' : 'Set Password'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password set success dialog — shows the password once with copy button */}
      <Dialog open={passwordSuccessOpen} onOpenChange={(v) => { if (!v) setSavedPassword(""); setPasswordSuccessOpen(v); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password updated</DialogTitle>
            <DialogDescription>
              The new password for {passwordTarget?.name ?? 'the user'} is shown below. Copy it now — it will not be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <code className="font-mono px-3 py-2 bg-white rounded border break-all">{savedPassword}</code>
              <Button variant="ghost" onClick={() => { try { navigator.clipboard.writeText(savedPassword); toast.success('Copied to clipboard'); } catch (e) { toast.error('Failed to copy'); } }}>Copy</Button>
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-end">
              <Button onClick={() => { setPasswordSuccessOpen(false); setSavedPassword(""); setPasswordTarget(null); }}>Done</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inline Edit Dialog (rich layout like attached modal) */}
      <Dialog open={editOpen} onOpenChange={(v) => setEditOpen(v)}>
        <DialogContent>
          <div className="max-w-3xl">
            <DialogHeader className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-full p-3 bg-gradient-to-r from-electric-purple to-electric-blue text-white">
                  <Edit className="h-5 w-5" />
                </span>
                <div>
                  <DialogTitle className="text-lg font-semibold">Edit Distributor</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">Update the details for {editValues?.name ?? ""}.</DialogDescription>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setEditOpen(false)} aria-label="Close">✕</button>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <section>
                <h4 className="text-sm font-medium mb-3">Company Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium">Company Name *</label>
                    <Input value={editValues?.companyName ?? ""} className={editErrors.companyName ? 'border-red-600 ring-1 ring-red-600' : ''} onChange={(e) => { const v = (e.target as HTMLInputElement).value; setEditValues((s: any) => ({ ...s, companyName: v })); validateEdit({ ...editValues, companyName: v }); }} />
                    {editErrors.companyName ? <p className="text-xs text-red-600 mt-1">{editErrors.companyName}</p> : null}
                  </div>
                  <div>
                    <label className="text-xs font medium">Address *</label>
                    <Input placeholder="Street, City, Country" value={editValues?.address ?? ""} className={editErrors.address ? 'border-red-600 ring-1 ring-red-600' : ''} onChange={(e) => { const v = (e.target as HTMLInputElement).value; setEditValues((s: any) => ({ ...s, address: v })); validateEdit({ ...editValues, address: v }); }} />
                    {editErrors.address ? <p className="text-xs text-red-600 mt-1">{editErrors.address}</p> : null}
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-medium mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium">Email Address *</label>
                    <Input value={editValues?.email ?? ""} className={editErrors.email ? 'border-red-600 ring-1 ring-red-600' : ''} onChange={(e) => { const v = (e.target as HTMLInputElement).value; setEditValues((s: any) => ({ ...s, email: v })); validateEdit({ ...editValues, email: v }); }} />
                    {editErrors.email ? <p className="text-xs text-red-600 mt-1">{editErrors.email}</p> : null}
                  </div>
                  <div>
                    <label className="text-xs font-medium">Phone Number *</label>
                    <Input value={editValues?.phone ?? ""} className={editErrors.phone ? 'border-red-600 ring-1 ring-red-600' : ''} onChange={(e) => { const v = (e.target as HTMLInputElement).value; setEditValues((s: any) => ({ ...s, phone: v })); validateEdit({ ...editValues, phone: v }); }} />
                    {editErrors.phone ? <p className="text-xs text-red-600 mt-1">{editErrors.phone}</p> : null}
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-medium mb-3">Account Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium">Status</label>
                    <Select onValueChange={(val) => setEditValues((s: any) => ({ ...s, status: val }))} value={editValues?.status ?? "active"}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Keys Assigned removed per request */}
                </div>
              </section>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditOpen(false)} disabled={actionInFlight}>Cancel</Button>
              <Button onClick={handleSaveEdit} disabled={actionInFlight || Object.keys(editErrors).length > 0} className="bg-gradient-to-r from-electric-purple to-electric-blue text-white">
                {actionInFlight ? "Saving..." : "Update Distributor"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

