import { HomeLayout } from 'app/features/home/layout.web'
import Head from 'next/head'
import { userProtectedGetSSP } from 'utils/userProtected'
import { NextPageWithLayout } from '../_app'
import { AccountScreen } from 'app/features/account/screen'
import { AccountTopNav } from 'app/features/account/AccountTopNav'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Account</title>
        <meta
          name="description"
          content="Send Tags simplify transactions by replacing long wallet addresses with memorable identifiers."
          key="desc"
        />
      </Head>
      <AccountScreen />
    </>
  )
}

export const getServerSideProps = userProtectedGetSSP()
Page.getLayout = (children) => (
  <HomeLayout header="Account" TopNav={AccountTopNav}>
    {children}
  </HomeLayout>
)

export default Page
