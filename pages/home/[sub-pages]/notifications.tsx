import { NotificationsContainer } from '@/containers/home/sub-pages'
import { PageProps } from '@/utils/types'
import React from 'react'

export default function NotificationsPage({ props }: {props: PageProps}) {
  return <NotificationsContainer props={props}/>
}
