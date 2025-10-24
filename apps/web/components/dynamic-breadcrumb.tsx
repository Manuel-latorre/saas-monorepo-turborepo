"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function toTitleCase(segment: string) {
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function DynamicBreadcrumb() {
  const pathname = usePathname() || "/"
  const parts = pathname.split("/").filter(Boolean)
  const hrefs = parts.map((_, idx) => "/" + parts.slice(0, idx + 1).join("/"))

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {parts.length === 0 ? (
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          parts.map((part, index) => {
            const isLast = index === parts.length - 1
            const label = toTitleCase(part)
            const href = hrefs[index]
            return (
              <span key={href} className="flex items-center">
                <BreadcrumbItem className="hidden md:block">
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href as string}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </span>
            )
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}


