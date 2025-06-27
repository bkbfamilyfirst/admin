"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { UserCheck, Copy, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface NDCredentialsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    ndInfo: {
        id: string
        name: string
        email: string
        defaultPassword: string
        companyName: string
    } | null
}

export function NDCredentialsModal({ open, onOpenChange, ndInfo }: NDCredentialsModalProps) {
    const [showPassword, setShowPassword] = useState(true)

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard!`)
    }

    const copyAllCredentials = () => {
        if (!ndInfo) return
        
        const credentials = `
National Distributor Credentials:
Name: ${ndInfo.name}
Email: ${ndInfo.email}
Password: ${ndInfo.defaultPassword}
Company: ${ndInfo.companyName}

Please change the password after first login.
        `.trim()
        
        navigator.clipboard.writeText(credentials)
        toast.success("All credentials copied to clipboard!")
    }

    if (!ndInfo) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-green-600 flex items-center gap-3">
                        <div className="rounded-full p-2 bg-green-100">
                            <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                        National Distributor Created Successfully!
                    </DialogTitle>
                    <DialogDescription className="text-amber-700 font-medium bg-amber-50 p-3 rounded-lg border border-amber-200">
                        ⚠️ <strong>IMPORTANT:</strong> Please copy and securely share these credentials with the National Distributor. The password will not be shown again!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Credentials Display */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Login Credentials</h3>
                        
                        <div className="space-y-3">
                            {/* Name */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Name:</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-900 dark:text-gray-100 font-medium">{ndInfo.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(ndInfo.name, "Name")}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Email:</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-900 dark:text-gray-100 font-medium">{ndInfo.email}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(ndInfo.email, "Email")}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex justify-between items-center border-t pt-3">
                                <span className="text-sm font-medium text-red-600">Password:</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-3 py-2 rounded">
                                        <span className="font-mono text-red-700 font-bold text-lg">
                                            {showPassword ? ndInfo.defaultPassword : '••••••••'}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="h-6 w-6 p-0 ml-1"
                                        >
                                            {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(ndInfo.defaultPassword, "Password")}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={copyAllCredentials}
                            className="flex-1"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy All Credentials
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button 
                        className="w-full bg-gradient-to-r from-electric-purple to-electric-blue text-white" 
                        onClick={() => onOpenChange(false)}
                    >
                        I have copied the credentials - Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
