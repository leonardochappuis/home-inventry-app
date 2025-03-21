"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewTable } from "@/components/overview-table"
import { RecentItems } from "@/components/recent-items"
import { Stats } from "@/components/stats"
import { FileText, Grid, Tag, Menu } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
// Import the new component
import { DirectAddButton } from "@/components/direct-add-button"

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex md:hidden items-center justify-between">
        <h1 className="text-xl font-bold">Home Inventory</h1>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-[57px] z-20 bg-background border-b transition-all duration-200 ease-in-out",
          mobileMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        {/* Replace the AddItemButton in the mobile menu with DirectAddButton */}
        <div className="p-4 space-y-2">
          <DirectAddButton className="w-full justify-start" />
          <Link href="/items" passHref>
            <Button className="w-full justify-start" variant="outline">
              <Grid className="mr-2 h-4 w-4" />
              View All Items
            </Button>
          </Link>
          <Link href="/categories" passHref>
            <Button className="w-full justify-start" variant="outline">
              <Tag className="mr-2 h-4 w-4" />
              Manage Categories
            </Button>
          </Link>
          <Link href="/reports" passHref>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </Link>
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between md:mt-0 mt-2">
          <h1 className="text-3xl font-bold tracking-tight hidden md:block">Home Inventory</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Stats />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-7">
          <Card className="md:col-span-5 overflow-hidden">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>View the total value of your inventory by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[240px]">
              <div className="w-full h-full">
                <OverviewTable />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 hidden md:block">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your inventory with these quick actions</CardDescription>
            </CardHeader>
            {/* Also replace the AddItemButton in the Quick Actions section */}
            <CardContent className="flex flex-col gap-2">
              <DirectAddButton className="w-full justify-start">Add New Item</DirectAddButton>
              <Link href="/items" passHref>
                <Button className="w-full justify-start" variant="outline">
                  <Grid className="mr-2 h-4 w-4" />
                  View All Items
                </Button>
              </Link>
              <Link href="/categories" passHref>
                <Button className="w-full justify-start" variant="outline">
                  <Tag className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </Link>
              <Link href="/reports" passHref>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recently Added Items</CardTitle>
            <CardDescription>Your most recently added inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentItems />
          </CardContent>
          <CardFooter>
            <Link href="/items" passHref>
              <Button variant="outline">View All Items</Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

