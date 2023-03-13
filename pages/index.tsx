import MainPage from './main'
import React from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function index() {
  return ( 
  <QueryClientProvider client={queryClient}>
    <MainPage />
  </QueryClientProvider>
  )
}
