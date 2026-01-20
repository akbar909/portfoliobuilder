import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 whitespace-nowrap">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-0 border rounded-xl overflow-hidden">
                        <div className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="p-4 pt-0">
                            <Skeleton className="h-7 w-12" />
                            <Skeleton className="h-3 w-32 mt-1" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 border rounded-xl p-4">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
                <div className="col-span-3 border rounded-xl p-4">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
