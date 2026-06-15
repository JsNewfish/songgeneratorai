import type { Metadata } from 'next'
import MyCreationsClient from './my-creations-client'

export const metadata: Metadata = {
  title: 'My Creations',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MyCreationsClient />
}
