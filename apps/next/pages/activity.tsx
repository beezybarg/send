import { ActivityScreen } from 'app/features/activity/screen'
import { HomeLayout } from 'app/features/home/layout.web'
import Head from 'next/head'
import { userProtectedGetSSP } from 'utils/userProtected'
import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>/send | Activity</title>
      </Head>
      <ActivityScreen />
    </>
  )
}

export const getServerSideProps = userProtectedGetSSP()

Page.getLayout = (children) => <HomeLayout header="Activity">{children}</HomeLayout>

export default Page
