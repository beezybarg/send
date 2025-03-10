import { SecretShopScreen } from 'app/features/secret-shop/screen'
import { HomeLayout } from 'app/features/home/layout.web'
import Head from 'next/head'
import { userProtectedGetSSP } from 'utils/userProtected'
import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>/send | Secret Shop</title>
      </Head>
      <SecretShopScreen />
    </>
  )
}
export const getServerSideProps = userProtectedGetSSP()

Page.getLayout = (children) => <HomeLayout header="Secret Shop">{children}</HomeLayout>

export default Page
