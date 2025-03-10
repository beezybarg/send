import { Link, Paragraph, type LinkProps } from '@my/ui'
import { usePathname } from 'app/utils/usePathname'
import { type ReactElement } from 'react'
import { useThemeSetting } from '@tamagui/next-theme'

export function SettingsNavLink({
  text,
  ...props
}: { text: string } & Omit<LinkProps, 'children'>): ReactElement {
  const location = usePathname()
  const href = props.href.toString().split('?')[0]
  const isActiveRoute = href === '/account' ? location === href : location.includes(href as string)

  const { resolvedTheme } = useThemeSetting()
  const iconActiveColor = resolvedTheme?.startsWith('dark') ? '$primary' : '$color12'
  const iconInActiveColor = resolvedTheme?.startsWith('dark') ? '$color' : '$color12'

  return (
    <Link
      {...props}
      href={props.disabled ? '' : props.href}
      hoverStyle={
        props.disabled ? {} : { opacity: 1, backgroundColor: 'transparent', borderWidth: 0 }
      }
      cursor={props.disabled ? 'not-allowed' : 'pointer'}
      opacity={isActiveRoute ? 1 : 0.63}
      disabled={props.disabled}
    >
      <Paragraph
        f={1}
        $md={{ fontSize: '$5' }}
        fontWeight={isActiveRoute ? 'bold' : '300'}
        color={isActiveRoute ? iconActiveColor : iconInActiveColor}
      >
        {text}
      </Paragraph>
    </Link>
  )
}
