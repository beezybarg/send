import { useThemeSetting } from '@tamagui/next-theme'
import { useStringFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import { Fieldset, Label, TextArea, TextAreaProps, Theme, useThemeName } from 'tamagui'
import { FieldError } from '../FieldError'
import { Shake } from '../Shake'

export const TextAreaField = (
  props: Pick<
    TextAreaProps,
    'size' | 'autoFocus' | 'accessibilityLabel' | 'placeholder' | 'fontStyle'
  >
) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<string>()
  const { label, isOptional, placeholder } = useStringFieldInfo()
  const themeName = useThemeName()
  const id = useId()
  const disabled = isSubmitting
  const { resolvedTheme } = useThemeSetting()

  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset>
        {!!label && (
          <Label
            size={props.size || '$5'}
            fontFamily={'$mono'}
            lineHeight={52}
            htmlFor={id}
            textTransform={'uppercase'}
          >
            {label} {isOptional && '(Optional)'}
          </Label>
        )}
        <Shake shakeKey={error?.errorMessage}>
          <TextArea
            disabled={disabled}
            borderWidth={0}
            borderRadius={'$4'}
            backgroundColor={'$charcoal'}
            color={'$color12'}
            placeholderTextColor="$color05"
            value={field.value}
            onChangeText={(text) => field.onChange(text)}
            onBlur={field.onBlur}
            ref={field.ref}
            placeholder={placeholder}
            id={id}
            rows={1}
            // temp fix
            // height={150}
            {...props}
          />
        </Shake>
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}
