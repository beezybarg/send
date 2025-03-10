import {
  BigHeading,
  ButtonText,
  FormWrapper,
  H3,
  Paragraph,
  SubmitButton,
  Theme,
  XStack,
  YStack,
} from '@my/ui'
import { MobileOtpType } from '@supabase/supabase-js'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ConfirmSchema = z.object({
  token: formFields.text,
})

export type VerifyCodeProps = {
  phone: string
  onSuccess: () => void
  type?: MobileOtpType
}

export const VerifyCode = ({ phone, onSuccess, type = 'sms' }: VerifyCodeProps) => {
  const supabase = useSupabase()
  const form = useForm<z.infer<typeof ConfirmSchema>>()
  async function confirmCode({ token }: z.infer<typeof ConfirmSchema>) {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type,
    })

    if (error) {
      const errorMessage = error?.message.toLowerCase()
      form.setError('token', { type: 'custom', message: errorMessage })
    } else {
      onSuccess()
    }
  }

  return (
    <FormWrapper>
      <SchemaForm
        form={form}
        schema={ConfirmSchema}
        onSubmit={confirmCode}
        defaultValues={{ token: '' }}
        props={{
          token: {
            accessibilityLabel: 'One-time Password',
            '$theme-dark': {
              borderBottomColor: '$accent9Light',
            },
            '$theme-light': {
              borderBottomColor: '$black',
            },
            borderWidth: 0,
            borderBottomWidth: 2,
            borderRadius: '$0',
            placeholder: 'Code',
            width: '100%',
            backgroundColor: 'transparent',
            color: '$background',
            themeInverse: true,
            fontFamily: '$mono',
            fontVariant: ['tabular-nums'],
            fontSize: '$7',
            $sm: {
              w: '60%',
            },
            // @todo move these to OTP form when that becomes stable
            textContentType: 'oneTimeCode',
            autoComplete: 'one-time-code',
            outlineColor: 'transparent',
          },
        }}
        renderAfter={({ submit }) => (
          <XStack
            f={1}
            mt={'0'}
            jc={'flex-end'}
            $sm={{ jc: 'center', height: '100%' }}
            ai={'flex-start'}
          >
            <SubmitButton
              onPress={() => submit()}
              br="$3"
              bc={'$accent9Light'}
              $sm={{ w: '100%' }}
              $gtMd={{
                mt: '0',
                als: 'flex-end',
                mx: 0,
                ml: 'auto',
                w: '$10.5',
                h: '$3.5',
              }}
            >
              <ButtonText size={'$1'} padding={'unset'} ta="center" margin={'unset'} col="black">
                {'VERIFY ACCOUNT'}
              </ButtonText>
            </SubmitButton>
          </XStack>
        )}
      >
        {(fields) => (
          <YStack gap="$5" jc="center" $sm={{ f: 1 }}>
            <Theme inverse={true}>
              <BigHeading col="$background">VERIFY ACCOUNT</BigHeading>
            </Theme>
            <H3
              lineHeight={28}
              $platform-web={{ fontFamily: '$mono' }}
              $theme-light={{ col: '$gray10Light' }}
              $theme-dark={{ col: '$olive' }}
              fontWeight={'300'}
              $sm={{ size: '$5' }}
            >
              Enter the code we sent you on your phone.
            </H3>
            <YStack gap="$4">
              <Theme inverse={true}>
                <Paragraph col="$background" size={'$1'} fontWeight={'500'}>
                  Your Code
                </Paragraph>
              </Theme>
              <XStack gap="$2">{Object.values(fields)}</XStack>
            </YStack>
          </YStack>
        )}
      </SchemaForm>
    </FormWrapper>
  )
}
