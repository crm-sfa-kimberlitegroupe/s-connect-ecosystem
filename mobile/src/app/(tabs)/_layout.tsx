import { Text } from 'react-native'
import { Tabs } from 'expo-router'
import { Colors } from '../../constants/theme'

function TabIcon({ name }: { name: string }) {
  return <Text style={{ fontSize: 20 }}>{name}</Text>
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Route',
          tabBarIcon: () => <TabIcon name="📍" />,
          headerTitle: 'Route du jour',
        }}
      />
      <Tabs.Screen
        name="visit"
        options={{
          title: 'Visite',
          tabBarIcon: () => <TabIcon name="✅" />,
          headerTitle: 'Visite en cours',
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Commande',
          tabBarIcon: () => <TabIcon name="🛒" />,
          headerTitle: 'Nouvelle Commande',
        }}
      />
      <Tabs.Screen
        name="merchandising"
        options={{
          title: 'Photo',
          tabBarIcon: () => <TabIcon name="📷" />,
          headerTitle: 'Merchandising',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: () => <TabIcon name="👤" />,
          headerTitle: 'Mon Profil',
        }}
      />
    </Tabs>
  )
}
