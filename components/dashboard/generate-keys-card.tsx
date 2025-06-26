"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Plus, Zap, Loader2 } from "lucide-react"
import { useState } from "react"
import { generateKeys } from "@/lib/api"
import { toast } from "sonner"
import { useDashboard } from "./dashboard-context"

export function GenerateKeysCard() {
  const [keyCount, setKeyCount] = useState("100")
  const [isGenerating, setIsGenerating] = useState(false)
  const { refreshDashboard } = useDashboard()

  const handleGenerateKeys = async () => {
    const count = parseInt(keyCount)
    
    if (!count || count <= 0) {
      toast.error("Please enter a valid number of keys to generate")
      return
    }

    if (count > 10000) {
      toast.error("Cannot generate more than 10,000 keys at once")
      return
    }

    setIsGenerating(true)
    try {
      const response = await generateKeys(count, 16) // 16 character keys
      toast.success(`Successfully generated ${count} keys!`)
      
      // Refresh all dashboard components
      refreshDashboard()
      
    } catch (error: any) {
      console.error('Error generating keys:', error)
      toast.error(error.response?.data?.message || "Failed to generate keys")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-pink/10 to-electric-orange/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-electric-pink/20 to-electric-orange/20 rounded-full -translate-y-14 translate-x-14"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Generate New Keys</CardTitle>
        <div className="rounded-full p-3 bg-gradient-to-r from-electric-pink to-electric-orange shadow-lg">
          <KeyRound className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="keyCount" className="text-sm font-medium">
            Number of Keys
          </Label>
          <Input
            id="keyCount"
            type="number"
            value={keyCount}
            onChange={(e) => setKeyCount(e.target.value)}
            className="border-electric-pink/30 focus:border-electric-pink focus:ring-electric-pink/20"
            placeholder="Enter quantity"
          />
        </div>
        <div className="grid grid-cols-1">
          <Button
            size="sm"
            className="bg-gradient-to-r from-electric-pink to-electric-orange hover:from-electric-pink/80 hover:to-electric-orange/80 text-white"
            onClick={handleGenerateKeys}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Generate
              </>
            )}
          </Button>
          {/* <Button
            size="sm"
            variant="outline"
            className="border-electric-pink/30 text-electric-pink hover:bg-electric-pink/10"
          >
            <Zap className="h-4 w-4 mr-1" />
            Bulk Gen
          </Button> */}
        </div>
        <div className="text-xs text-muted-foreground">Last generated: 500 keys (2 hours ago)</div>
      </CardContent>
    </Card>
  )
}
