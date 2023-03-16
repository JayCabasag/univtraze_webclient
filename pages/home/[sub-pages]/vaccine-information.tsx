import { VaccineInformationContainer } from '@/containers/home/sub-pages'
import { PageProps } from '@/utils/types'
import React from 'react'

export default function VaccineInformationSubPage({ props }: {props: PageProps}) {
  return <VaccineInformationContainer props={props} />
}
