"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Lock, Eye, EyeOff, Save, Loader2 } from "lucide-react"
import { changeAdminPassword } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function BasicSettings() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSaving, setIsSaving] = useState(false)

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const validatePasswordForm = () => {
        const newErrors: Record<string, string> = {}

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Current password is required."
        }
        if (!passwordData.newPassword) {
            newErrors.newPassword = "New password is required."
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = "New password must be at least 6 characters long."
        }
        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Confirm new password is required."
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "New password and confirm password do not match."
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handlePasswordSave = async () => {
        if (!validatePasswordForm()) {
            return
        }

        setIsSaving(true)
        try {
            await changeAdminPassword(passwordData.currentPassword, passwordData.newPassword)
            toast({
                title: "Success",
                description: "Password changed successfully!",
            });
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        } catch (err: any) {
            console.error("Failed to change password:", err)
            toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to change password.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="rounded-full p-2 bg-gradient-to-r from-electric-orange to-electric-pink">
                        <Settings className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                        Basic Settings
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Change Password Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <Lock className="h-4 w-4 text-electric-orange" />
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Change Password</h3>
                    </div>

                    <div className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-sm font-medium">
                                Current Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                    className={`border-electric-orange/30 focus:border-electric-orange focus:ring-electric-orange/20 pr-10 ${errors.currentPassword ? "border-red-500" : ""}`}
                                    placeholder="Enter current password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword}</p>}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-sm font-medium">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                    className={`border-electric-pink/30 focus:border-electric-pink focus:ring-electric-pink/20 pr-10 ${errors.newPassword ? "border-red-500" : ""}`}
                                    placeholder="Enter new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                    className={`border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                                    placeholder="Confirm new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                        </div>

                        {/* Password Requirements */}
                        <div className="p-3 rounded-lg bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• At least 8 characters long</li>
                                <li>• Contains uppercase and lowercase letters</li>
                                <li>• Contains at least one number</li>
                                <li>• Contains at least one special character</li>
                            </ul>
                        </div>

                        {/* Save Password Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handlePasswordSave}
                                disabled={isSaving}
                                className="bg-gradient-to-r from-electric-orange to-electric-pink hover:opacity-90 text-white"
                            >
                                {isSaving ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                {isSaving ? "Saving..." : "Update Password"}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
