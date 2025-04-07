"use client"

import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

export type SOPVersion = {
  version: string
  date: string
  author: string
  changes: string
  content?: string
  status: string
}

interface VersionHistoryProps {
  versions: SOPVersion[]
  currentVersion: string
}

export function VersionHistory({ versions, currentVersion }: VersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<SOPVersion | null>(null)

  // Sort versions in descending order (newest first)
  const sortedVersions = [...versions].sort((a, b) => {
    const [aMajor, aMinor] = a.version.split(".").map(Number)
    const [bMajor, bMinor] = b.version.split(".").map(Number)

    if (aMajor !== bMajor) return bMajor - aMajor
    return bMinor - aMinor
  })

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Version History</CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CardDescription>Track changes made to this SOP over time</CardDescription>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Changes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedVersions.map((version) => (
                  <TableRow key={version.version} className={version.version === currentVersion ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">v{version.version}</TableCell>
                    <TableCell>{formatDate(version.date)}</TableCell>
                    <TableCell>{version.author}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{version.changes}</TableCell>
                    <TableCell>{version.status}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedVersion(version)}>
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Version {version.version} Details</DialogTitle>
                            <DialogDescription>
                              Created on {formatDate(version.date)} by {version.author}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium mb-1">Changes</h3>
                              <p className="text-sm">{version.changes}</p>
                            </div>
                            {version.content && (
                              <div>
                                <h3 className="text-sm font-medium mb-1">Content</h3>
                                <div className="border rounded-md p-4 bg-muted/20 max-h-[400px] overflow-y-auto">
                                  <div
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html: version.content
                                        .replace(/^# (.*$)/gim, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
                                        .replace(/^## (.*$)/gim, "<h4 class='text-md font-semibold mt-3 mb-1'>$1</h4>")
                                        .replace(/^### (.*$)/gim, "<h5 class='text-sm font-semibold mt-2 mb-1'>$1</h5>")
                                        .replace(/- (.*)/gim, "<li>$1</li>")
                                        .replace(/([0-9]+)\. (.*)/gim, "<li>$2</li>")
                                        .replace(/\n/gim, "<br />"),
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

