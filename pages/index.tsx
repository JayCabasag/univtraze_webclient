import MainPage from './main'
import React from 'react'
import { GetServerSideProps } from 'next'
import cookie from 'cookie'
import { decodeJWT } from '@/utils/helpers'

export default function index() {
  return <MainPage />
}
