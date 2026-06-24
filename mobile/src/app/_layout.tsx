import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { authService } from '../services/auth.service'
import { useRouter, useSegments } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    async function prepare() {
      const authenticated = await authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      setIsReady(true)
      await SplashScreen.hideAsync()
    }
    prepare()
  }, [])

  useEffect(() => {
    if (!isReady) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [isAuthenticated, segments, isReady])

  if (!isReady) return null

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
