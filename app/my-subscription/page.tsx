import type { Metadata } from 'next'
import MySubscriptionClient from './my-subscription-client'

export const metadata: Metadata = {
  title: 'My Subscription',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <MySubscriptionClient />
}
