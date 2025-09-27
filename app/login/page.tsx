"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      router.replace("/")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter username, email, or phone and password.")
      toast.error("Please enter username, email, or phone and password.")
      setLoading(false)
      return
    }
    try {
      const res = await api.post("/auth/login", { identifier, password, role: 'admin' })
      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken)
        // Optionally store user info in context or localStorage
        // localStorage.setItem("user", JSON.stringify(res.data.user))
        toast.success("Logged in successfully!")
        router.replace("/")
      } else {
        setError("Invalid response from server.")
        toast.error("Invalid response from server.")
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.")
      toast.error(err?.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-electric-blue/10 to-electric-purple/10">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">Sign In</h2>
        <div className="space-y-2">
          <label htmlFor="identifier" className="text-sm font-medium">Username, Email, or Phone</label>
          <Input
            id="identifier"
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="Enter your username, email, or phone"
            autoComplete="username"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <Button type="submit" className="w-full bg-gradient-to-r from-electric-blue to-electric-purple text-white" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  )
} 