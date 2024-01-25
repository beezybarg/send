import { Container, ScrollView, YStack } from '@my/ui'
import { HomeHeader } from 'app/components/HomeHeader'
import { HomeSideBarWrapper } from 'app/components/sidebar/HomeSideBar'

export function HomeLayout({
  children,
  header = '',
}: { children: React.ReactNode; header?: string }) {
  return (
    <HomeSideBarWrapper>
      <YStack h="100svh" f={1}>
        <ScrollView f={3} fb={0} backgroundColor={'$background05'}>
          <Container>
            <YStack gap="$6" pt="$5" pb="$2" w={'100%'}>
              <HomeHeader>{header}</HomeHeader>
            </YStack>
          </Container>
          {children}
        </ScrollView>
      </YStack>
    </HomeSideBarWrapper>
  )
}
