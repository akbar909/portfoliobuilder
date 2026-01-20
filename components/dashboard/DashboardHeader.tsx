"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import DashboardProfileMenu from "./DashboardProfileMenu"

const routeLabels: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/hero": "Hero Section",
    "/dashboard/about": "About",
    "/dashboard/projects": "Projects",
    "/dashboard/experience": "Experience",
    "/dashboard/education": "Education",
    "/dashboard/contact": "Contact",
    "/dashboard/theme": "Theme",
    "/dashboard/settings": "Settings",
    "/dashboard/superadmin": "Admin",
}

export function DashboardHeader() {
    const { user } = useCurrentUser()
    const pathname = usePathname()
    const currentLabel = routeLabels[pathname] || "Dashboard"
    const isOverview = pathname === "/dashboard"

    return (
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    {!isOverview && (
                        <>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-2">
                {/* Superadmin Button */}
                {(user as any)?.role === "superadmin" && (
                    <Link href="/dashboard/superadmin">
                        <Button variant="ghost" size="icon" title="Superadmin Dashboard">
                            <Shield className="h-4 w-4" />
                        </Button>
                    </Link>
                )}
                <ThemeToggle />
                <DashboardProfileMenu />
            </div>
        </header>
    )
}
