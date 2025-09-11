"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Save, X, Copy } from "lucide-react"
import { NationalDistributor, addNationalDistributor, AddNDResponse } from "@/lib/api"
import { toast } from "sonner"
import { NDCredentialsModal } from "./nd-credentials-modal"

interface AddDistributorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddDistributor: (distributor: NationalDistributor) => void
}

export function AddDistributorModal({ open, onOpenChange, onAddDistributor }: AddDistributorModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        location: "",
        email: "",
        phone: "",
        status: "active",
        assignedKeys: "0",
        password: "",
        notes: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [createdNDInfo, setCreatedNDInfo] = useState<any>(null)

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) newErrors.name = "Company name is required"
        if (!formData.username.trim()) newErrors.username = "Username is required"
        if (!formData.location.trim()) newErrors.location = "Location is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        if (isNaN(Number(formData.assignedKeys)) || Number(formData.assignedKeys) < 0) {
            newErrors.assignedKeys = "Initial keys must be a valid number"
        }
        if (!formData.password.trim()) newErrors.password = "Password is required"
        else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            const newDistributorData = {
                companyName: formData.name,
                name: formData.name,
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                status: formData.status,
                assignedKeys: Number(formData.assignedKeys),
                password: formData.password,
                notes: formData.notes,
            }
            const response: AddNDResponse = await addNationalDistributor(newDistributorData)
            
            console.log('API Response:', response) // Debug log
            
            toast.success(response.message || "National Distributor added successfully!")
            
            // Set the ND info with password to show in modal
            if (response.nd) {
                setCreatedNDInfo({
                    id: response.nd.id,
                    name: response.nd.name,
                    email: response.nd.email,
                    username: response.nd.username,
                    phone: response.nd.phone,
                    password: response.nd.password || formData.password,
                    companyName: response.nd.companyName || formData.name,
                })
                setShowPasswordModal(true)
            } else {
                console.error('No ND data in response:', response)
                toast.warning("ND created but credentials not returned. Please check manually.")
            }
            
            // The backend should return the full NationalDistributor object with ID, createdAt, etc.
            // For now, we'll construct a dummy one if backend doesn't return full object immediately
            const createdDistributor: NationalDistributor = {
                id: response.nd?.id || `nd_${Date.now()}`,
                name: formData.name,
                location: formData.location,
                email: formData.email,
                phone: formData.phone,
                status: formData.status,
                assignedKeys: Number(formData.assignedKeys),
                usedKeys: 0,
                balance: Number(formData.assignedKeys),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            onAddDistributor(createdDistributor)
            // Do not close the main modal yet, let user see password first
        } catch (error: any) {
            console.error("Failed to add national distributor:", error)
            toast.error(error.response?.data?.message || "Failed to add national distributor.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setFormData({
            name: "",
            username: "",
            location: "",
            email: "",
            phone: "",
            status: "active",
            assignedKeys: "0",
            password: "",
            notes: "",
        })
        setErrors({})
        onOpenChange(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={(isOpen) => {
                // Prevent closing if password modal is showing
                if (!isOpen && showPasswordModal) return;
                onOpenChange(isOpen);
            }}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
                                <UserPlus className="h-5 w-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                                Add New National Distributor
                            </span>
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new national distributor to your network.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Company Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                                Company Information
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Company Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className={`border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20 ${errors.name ? "border-red-500" : ""
                                            }`}
                                        placeholder="e.g., TechGuard Solutions"
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-sm font-medium">
                                        Username *
                                    </Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange("username", e.target.value)}
                                        className={`border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20 ${errors.username ? "border-red-500" : ""}`}
                                        placeholder="e.g., techguard.nd"
                                    />
                                    {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm font-medium">
                                        Location *
                                    </Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        className={`border-electric-blue/30 focus:border-electric-blue focus:ring-electric-blue/20 ${errors.location ? "border-red-500" : ""
                                            }`}
                                        placeholder="e.g., New York, USA"
                                    />
                                    {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                                Contact Information
                            </h3>

                            <div className="space-y-4">
                                {/* Removed contact person input as it's not in the API response */}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email Address *
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className={`border-electric-cyan/30 focus:border-electric-cyan focus:ring-electric-cyan/20 ${errors.email ? "border-red-500" : ""
                                                }`}
                                            placeholder="john@company.com"
                                        />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium">
                                            Phone Number *
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className={`border-electric-orange/30 focus:border-electric-orange focus:ring-electric-orange/20 ${errors.phone ? "border-red-500" : ""
                                                }`}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                                Account Settings
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="notes" className="text-sm font-medium">
                                        Notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => handleInputChange("notes", e.target.value)}
                                        className="border-electric-blue/30 focus:border-electric-blue focus:ring-electric-blue/20"
                                        placeholder="Any additional notes..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-sm font-medium">
                                        Initial Status
                                    </Label>
                                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                                        <SelectTrigger id="status" className="border-electric-pink/30">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="assignedKeys" className="text-sm font-medium">
                                        Initial Keys Allocation
                                    </Label>
                                    <Input
                                        id="assignedKeys"
                                        type="number"
                                        min="0"
                                        value={formData.assignedKeys}
                                        onChange={(e) => handleInputChange("assignedKeys", e.target.value)}
                                        className={`border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20 ${errors.assignedKeys ? "border-red-500" : ""
                                            }`}
                                        placeholder="0"
                                    />
                                    {errors.assignedKeys && <p className="text-xs text-red-500">{errors.assignedKeys}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Set Password *
                                    </Label>
                                    <Input
                                        id="password"
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        className={`border-electric-orange/30 focus:border-electric-orange focus:ring-electric-orange/20 ${errors.password ? "border-red-500" : ""}`}
                                        placeholder="Enter password for ND account"
                                    />
                                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={handleClose} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-electric-purple to-electric-blue hover:opacity-90 text-white"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Adding..." : "Add Distributor"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* New Credentials Modal */}
            <NDCredentialsModal
                open={showPasswordModal}
                onOpenChange={(open) => {
                    setShowPasswordModal(open)
                    if (!open) {
                        setCreatedNDInfo(null)
                        handleClose()
                    }
                }}
                ndInfo={createdNDInfo}
            />
        </>
    )
}
