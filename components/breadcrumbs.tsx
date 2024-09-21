'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

export default function Breadcrumbs() {
  const [updatedBreadcrumb, setUpdatedBreadcrumb] = useState<string>('')

  const supabase = createClient()
  const searchParams = useSearchParams()
  const params = useParams()

  useEffect(() => {
    if (searchParams.has('q')) {
      const getLeadData = async () => {
        const { data } = await supabase
          .from('leads')
          .select()
          .eq('id', searchParams.get('q') || '')
          .single()

        setUpdatedBreadcrumb(data?.name ?? '')
      }

      getLeadData()
    } else if (params.slug) {
      const getClientData = async () => {
        const { data } = await supabase
          .from('clients')
          .select()
          .eq('slug', params.slug)
          .single()

        setUpdatedBreadcrumb(data?.company_name ?? data?.name ?? '')
      }

      getClientData()
    }
  }, [searchParams, params])

  const pathname = usePathname()
  const splitPath = pathname.split('/').filter((path) => path !== '')

  const items: { title: string, link: string }[] = []

  items.push({ title: 'Dashboard', link: '/' })
  
  items.concat(splitPath.map((path, index) => {
    return {
      title: path.charAt(0).toUpperCase() + path.slice(1),
      link: `/${splitPath.slice(0, index + 1).join('/')}`,
    }
  }))

  if (searchParams.has('q')) {
    items.push({
      title: updatedBreadcrumb,
      link: `${pathname}?q=${searchParams.get('q')}`,
    })
  }

  if (params.slug) {
    items.pop()
    items.push({
      title: updatedBreadcrumb,
      link: `${pathname}`,
    })
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && <BreadcrumbSeparator />}
            {index === items.length - 1 && (
              <BreadcrumbPage>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
