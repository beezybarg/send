import { HomeScreen } from 'app/features/home/screen'
import { HomeLayout } from 'app/features/home/layout.web'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { userProtectedGetSSP } from 'utils/userProtected'
import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <HomeScreen />
    </>
  )
}
export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  setReferralCodeCookie(ctx)
  return userProtectedGetSSP()(ctx)
}

function setReferralCodeCookie(context: GetServerSidePropsContext) {
  // Read the 'code' query parameter from the request URL
  const referralCode = context.query.referral

  // Set the cookie on the client side if the referral code exists
  if (referralCode) {
    context.res.setHeader(
      'Set-Cookie',
      `referral=${referralCode}; Max-Age=${30 * 24 * 60 * 60}; Path=/; HttpOnly` // 30 days
    )
  }
}

Page.getLayout = (children) => <HomeLayout header="Home">{children}</HomeLayout>

export default Page
