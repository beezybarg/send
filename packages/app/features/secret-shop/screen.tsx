import {
  Paragraph,
  Stack,
  YStack,
  Theme,
  useToastController,
  Button,
  H3,
  XStack,
  Container,
  Spinner,
  Anchor,
} from '@my/ui'
import { useSendAccounts } from 'app/utils/send-accounts'
import { testClient } from 'app/utils/userop'
import { setERC20Balance } from 'app/utils/useSetErc20Balance'
import { baseMainnet, baseMainnetClient, sendTokenAddress, usdcAddress } from '@my/wagmi'
import { api } from 'app/utils/api'
import { parseEther } from 'viem'
import { shorten } from 'app/utils/strings'

export function SecretShopScreen() {
  const toast = useToastController()
  const {
    mutate: fundMutation,
    error: fundError,
    data: fundData,
    isPending: isFundPending,
  } = api.secretShop.fund.useMutation()
  const { data: sendAccts, isPending } = useSendAccounts()
  const sendAcct = sendAccts?.[0]

  if (isPending) {
    return (
      <Container>
        <Theme>
          <Spinner fullscreen size="large" color={'$accent10Light'} />
        </Theme>
      </Container>
    )
  }

  if (!sendAcct) {
    return (
      <Container>
        <Paragraph>No Send Account found. Did you create one?</Paragraph>
      </Container>
    )
  }

  return (
    <Container>
      <YStack w="100%" space="$4" f={1}>
        <Stack f={1} maw={600}>
          <Theme name="dim">
            <YStack pt="$4" gap="$4">
              <YStack gap="$2">
                <Paragraph>
                  Available on {baseMainnet.name} only. Your Send Account Address:
                </Paragraph>
                <XStack>
                  <Paragraph ta="center" fontWeight="bold" fontFamily="$mono">
                    <Anchor
                      href={`${baseMainnet.blockExplorers.default.url}/address/${sendAcct.address}`}
                    >
                      {sendAcct.address}
                    </Anchor>
                  </Paragraph>
                </XStack>
              </YStack>
              {__DEV__ && baseMainnet.id !== 84532 ? (
                <>
                  <Button
                    onPress={async () => {
                      await testClient.setBalance({
                        address: sendAcct.address,
                        value: parseEther('10'),
                      })
                      toast.show('Funded with 10 ETH')
                    }}
                  >
                    Fund with 10 ETH
                  </Button>
                  <Button
                    onPress={async () => {
                      await setERC20Balance({
                        client: testClient,
                        address: sendAcct.address,
                        tokenAddress: usdcAddress[baseMainnetClient.chain.id],
                        value: BigInt(100000000),
                      })
                      toast.show('Funded with 100 USDC')
                    }}
                  >
                    Fund with 100 USDC
                  </Button>
                  <Button
                    onPress={async () => {
                      await setERC20Balance({
                        client: testClient,
                        address: sendAcct.address,
                        tokenAddress: sendTokenAddress[baseMainnetClient.chain.id],
                        value: BigInt(1000000),
                      })
                      toast.show('Funded with 1M Send')
                    }}
                  >
                    Fund with 1M Send
                  </Button>
                </>
              ) : (
                <YStack>
                  <Button
                    disabled={isFundPending}
                    iconAfter={isFundPending ? <Spinner size="small" /> : undefined}
                    onPress={() => {
                      fundMutation({ address: sendAcct.address })
                    }}
                  >
                    Fund Account
                  </Button>
                  {fundError && <Paragraph color="$error">{fundError.message}</Paragraph>}
                  {fundData && (
                    <YStack gap="$2" mt="$4">
                      <Paragraph>Result</Paragraph>
                      {Object.entries(fundData).map(([key, value]) =>
                        value ? (
                          <Paragraph key={key}>
                            <Anchor href={`${baseMainnet.blockExplorers.default.url}/tx/${value}`}>
                              {key} transaction: {shorten(value)}
                            </Anchor>
                          </Paragraph>
                        ) : (
                          <Paragraph key={key}>{key}: too much balance.</Paragraph>
                        )
                      )}
                    </YStack>
                  )}
                </YStack>
              )}
            </YStack>
          </Theme>
        </Stack>
      </YStack>
    </Container>
  )
}
