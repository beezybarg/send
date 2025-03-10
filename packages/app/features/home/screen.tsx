import {
  Button,
  Container,
  Paragraph,
  Spinner,
  Tooltip,
  TooltipGroup,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import { useThemeSetting } from '@tamagui/next-theme'
import { IconDeposit, IconEthereum, IconSend, IconUSDC } from 'app/components/icons'
import {
  baseMainnet,
  usdcAddress as usdcAddresses,
  sendTokenAddress as sendAddresses,
} from '@my/wagmi'
import { useSendAccountBalances } from 'app/utils/useSendAccountBalances'
import formatAmount from 'app/utils/formatAmount'
import TokenDetails from './TokenDetails'

export function HomeScreen() {
  const { totalBalance } = useSendAccountBalances()

  const toast = useToastController()
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const coins = [
    { label: 'USDC', token: usdcAddresses[baseMainnet.id], icon: <IconUSDC size={'$2.5'} /> },
    { label: 'Ethereum', token: undefined, icon: <IconEthereum size={'$2.5'} /> },
    { label: 'Send', token: sendAddresses[baseMainnet.id], icon: <IconSend size={'$2.5'} /> },
  ]

  const { resolvedTheme } = useThemeSetting()
  const separatorColor = resolvedTheme?.startsWith('dark') ? '#343434' : '#E6E6E6'

  return (
    <>
      <Container fd={'column'}>
        <YStack
          $gtLg={{ width: 360 }}
          $sm={{ width: '100%' }}
          $gtSm={{ width: '100%' }}
          ai={'center'}
        >
          {/* Balance Card */}
          <XStack
            w={'100%'}
            jc={'center'}
            $md={{ borderColor: separatorColor, borderBottomWidth: 1 }}
          >
            <XStack w={'100%'} zIndex={4}>
              <YStack py={'$7'} $md={{ py: '$13' }}>
                <YStack jc={'center'} gap={'$6'}>
                  <TooltipGroup delay={{ open: 0, close: 1500 }}>
                    <Tooltip placement="bottom">
                      <Tooltip.Trigger>
                        <Paragraph
                          fontSize={'$4'}
                          zIndex={1}
                          color={'$color05'}
                          textTransform={'uppercase'}
                        >
                          Total Balance
                        </Paragraph>
                        <XStack style={{ color: 'white' }} gap={'$2.5'} mt={'$3'}>
                          {totalBalance === undefined ? (
                            <Spinner size={'large'} />
                          ) : (
                            <Paragraph
                              color={'$color12'}
                              fontFamily={'$mono'}
                              fontSize={'$15'}
                              lineHeight={'$14'}
                              fontWeight={'500'}
                              zIndex={1}
                            >
                              {formatAmount(totalBalance, 4, 0)}
                            </Paragraph>
                          )}
                          <Paragraph
                            color={'$color12'}
                            fontSize={'$6'}
                            fontWeight={'500'}
                            zIndex={1}
                          >
                            {'USD'}
                          </Paragraph>
                        </XStack>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
                        scale={1}
                        x={0}
                        y={0}
                        opacity={1}
                        animation={[
                          'quick',
                          {
                            opacity: {
                              overshootClamping: true,
                            },
                          },
                        ]}
                      >
                        <Tooltip.Arrow />
                        <Paragraph fontSize={'$6'} fontWeight={'500'}>
                          {totalBalance === undefined
                            ? null
                            : USDollar.format(Number(totalBalance))}
                        </Paragraph>
                      </Tooltip.Content>
                    </Tooltip>
                  </TooltipGroup>
                </YStack>
              </YStack>
            </XStack>
          </XStack>
          <XStack w={'100%'} ai={'center'} pt={'$7'}>
            <Button
              px={'$3.5'}
              h={'$8'}
              width={'100%'}
              backgroundColor={'$primary'}
              borderRadius={'$4'}
              onPress={() => {
                // @todo onramp / deposit
                toast.show('Coming Soon: Deposit')
              }}
            >
              <XStack w={'100%'} jc={'space-between'} ai={'center'}>
                <Paragraph
                  // fontFamily={'$mono'}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  color={'$black'}
                >
                  Deposit
                </Paragraph>
                <XStack alignItems={'center'} justifyContent={'center'} zIndex={2}>
                  <IconDeposit size={'$2.5'} color={'$black'} />
                </XStack>
              </XStack>
            </Button>
          </XStack>
          <YStack width={'100%'} $gtLg={{ gap: '$3.5' }} pt={'$6'} pb={'$12'}>
            {coins.map((coin, index) => (
              <TokenDetails
                coin={coin}
                key={coin.label}
                jc={'space-between'}
                ai={'center'}
                py={'$3.5'}
                borderColor={separatorColor}
                borderBottomWidth={index !== coins.length - 1 ? 1 : 0}
              />
            ))}
          </YStack>
        </YStack>
      </Container>
    </>
  )
}
