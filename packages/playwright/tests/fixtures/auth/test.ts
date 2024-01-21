import { type BrowserContext, mergeTests, test as base } from '@playwright/test'
import { test as ethereumTest } from '../ethereum'
import { test as webauthnTest } from '../webauthn'

import { Database } from '@my/supabase/database.types'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { countries } from 'app/utils/country'
import { SUPABASE_URL, supabaseAdmin } from 'app/utils/supabase/admin'
import debug from 'debug'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import config from '../../../playwright.config'
import { assert } from 'app/utils/assert'

const randomCountry = () =>
  countries[Math.floor(Math.random() * countries.length)] as (typeof countries)[number]

const log = debug('test:fixtures:auth:test')

const supabaseCookieRegex = /sb-[a-z0-9]+-auth-token/

export const getAuthSessionFromContext = async (context: BrowserContext) => {
  const cookies = await context.cookies()
  const authCookie = cookies.find((cookie) => cookie.name.match(supabaseCookieRegex))?.value
  if (!authCookie) {
    throw new Error('Supabase auth cookie not found')
  }

  // grab auth session from jwt
  const authSessionDecoded = decodeURIComponent(authCookie)
  const authSessionParsed = JSON.parse(authSessionDecoded)
  const token = authSessionParsed[0] as string
  const decoded = jwt.decode(token) as JwtPayload

  if (!decoded || !decoded.sub) {
    throw new Error('could not decode user jwt from cookie')
  }

  return { token, decoded }
}

const authTest = base.extend<{
  context: BrowserContext
  supabase: SupabaseClient<Database>
  authSession: { token: string; decoded: JwtPayload }
}>({
  context: async ({ context }, use) => {
    const { parallelIndex } = test.info()
    const randomNumber = Math.floor(Math.random() * 1e9)
    const country = randomCountry()
    const { data, error } = await supabaseAdmin.auth.signUp({
      phone: `+${country.dialCode}${randomNumber}`,
      password: 'changeme',
    })

    if (error) {
      log('error creating user', `id=${parallelIndex}`, error)
      throw error
    }

    if (!data?.user) {
      throw new Error('user not created')
    }

    if (!data?.session) {
      throw new Error('session not created')
    }

    const { user } = data
    const { session } = data
    const { access_token, refresh_token } = session

    log('created user', `id=${parallelIndex}`, `user=${user.id}`)

    if (!config?.use?.baseURL) {
      throw new Error('config.use.baseURL not defined')
    }

    // @note see how Supabase does it here: https://github.com/supabase/supabase-js/blob/f6bf008d8017ae013450ecd3fa806acad735bacc/src/SupabaseClient.ts#L95
    const subdomain = new URL(SUPABASE_URL).hostname.split('.')[0]
    assert(!!subdomain, 'subdomain not found')
    const name = `sb-${subdomain}-auth-token`
    const domain = new URL(config.use.baseURL).hostname
    assert(!!domain, 'domain not found')

    log(
      'setting auth cookie',
      `id=${parallelIndex}`,
      `user=${user.id}`,
      `domain=${domain}`,
      `name=${name}`
    )

    // set auth session cookie
    await context.addCookies([
      {
        name,
        value: encodeURIComponent(JSON.stringify([access_token, refresh_token, null, null, null])),
        domain,
        path: '/',
      },
    ])

    await use(context)

    // delete the user
    await supabaseAdmin.auth.admin.deleteUser(data.user.id).then(({ error }) => {
      if (error) {
        log('error deleting user', `id=${parallelIndex}`, `user=${user.id}`, error)
        throw error
      }
    })
  },
  authSession: async ({ context }, use) => {
    const { token, decoded } = await getAuthSessionFromContext(context)
    await use({ token, decoded })
  },
  supabase: async ({ authSession, context }, use) => {
    const { token } = authSession
    use(
      createClient(SUPABASE_URL, token, {
        auth: { persistSession: false },
        global: {
          fetch: async (url: URL | RequestInfo, init?: RequestInit) => {
            const headersObject = init?.headers
              ? init?.headers.entries instanceof Function
                ? Object.fromEntries(init?.headers.entries())
                : init?.headers
              : {}

            // Fetch using Playwright's context
            const response = await context.request.fetch(url.toString(), {
              method: init?.method,
              data: init?.body,
              headers: headersObject,
            })

            // Convert back to node-fetch response
            const responseBody = await response.text()
            const nodeFetchResponse = new Response(responseBody, {
              status: response.status(),
              statusText: response.statusText(),
              headers: response.headers(),
            })

            return nodeFetchResponse
          },
        },
      })
    )
  },
})
export const test = mergeTests(webauthnTest, ethereumTest, authTest)

export const expect = test.expect
