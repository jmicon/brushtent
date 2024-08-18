"use client"
import {Pagination, PaginationItem, PaginationCursor} from "@nextui-org/pagination";
import { useRouter } from "next/navigation"

type Props = {
    totalPages: number
    currentPage: number
    route?: string
}


const PaginationContainer = ({ totalPages, currentPage, route="/" }: Props) => {
    const router = useRouter()

    return (
        <>
        <div className="flex justify-center py-4">
            <Pagination 
                total={totalPages} 
                initialPage={1} 
                page={currentPage} 
                onChange={page => router.push(`${route}?page=${page}`)}
                showControls
                isCompact 
            />
        </div>
        </>
    )

}

export default PaginationContainer