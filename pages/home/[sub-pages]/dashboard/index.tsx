import { DashboardContainer } from '@/containers/home/sub-pages'
import { PageProps } from '@/utils/types'
import React from 'react'


export default function DashboardPage({ props }:{ props : PageProps}) {
  return <DashboardContainer props={props}/>
}
