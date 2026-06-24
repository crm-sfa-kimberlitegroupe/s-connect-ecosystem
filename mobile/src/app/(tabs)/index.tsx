import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { visitsService } from '../../services/visits.service'
import { Colors } from '../../constants/theme'
import type { Outlet, Visit } from '../../types'

export default function RouteScreen() {
  const router = useRouter()
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTodayRoute = useCallback(async () => {
    try {
      const data = await visitsService.getTodayVisits()
      setVisits(data)
    } catch {
      // Use mock data when API unavailable
      setVisits([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTodayRoute()
  }, [fetchTodayRoute])

  async function handleCheckin(outlet: Outlet) {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'La localisation est nécessaire pour le check-in')
      return
    }

    const location = await Location.getCurrentPositionAsync({})
    try {
      await visitsService.checkin(
        outlet.id,
        location.coords.latitude,
        location.coords.longitude,
      )
      Alert.alert('Check-in réussi', `Visite démarrée: ${outlet.name}`)
      router.push('/(tabs)/visit')
    } catch {
      Alert.alert('Erreur', 'Impossible de faire le check-in')
    }
  }

  function renderOutletItem({ item }: { item: Visit }) {
    const outlet = item.outlet
    const isCompleted = item.status === 'COMPLETED'
    const isInProgress = item.status === 'IN_PROGRESS'

    return (
      <View style={[styles.card, isCompleted && styles.cardCompleted]}>
        <View style={styles.cardHeader}>
          <View style={styles.statusDot}>
            <View
              style={[
                styles.dot,
                isCompleted && styles.dotCompleted,
                isInProgress && styles.dotInProgress,
              ]}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.outletName}>{outlet?.name || 'Point de Vente'}</Text>
            <Text style={styles.outletAddress}>{outlet?.address || 'Adresse non définie'}</Text>
            <Text style={styles.outletChannel}>{outlet?.channel || ''}</Text>
          </View>
        </View>

        {!isCompleted && !isInProgress && outlet && (
          <TouchableOpacity
            style={styles.checkinButton}
            onPress={() => handleCheckin(outlet)}
          >
            <Text style={styles.checkinButtonText}>Check-in</Text>
          </TouchableOpacity>
        )}

        {isInProgress && (
          <View style={styles.inProgressBadge}>
            <Text style={styles.inProgressText}>En cours</Text>
          </View>
        )}

        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Terminée</Text>
          </View>
        )}
      </View>
    )
  }

  const completedCount = visits.filter((v) => v.status === 'COMPLETED').length

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {completedCount}/{visits.length} visites effectuées
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: visits.length > 0 ? `${(completedCount / visits.length) * 100}%` : '0%' },
            ]}
          />
        </View>
      </View>

      <FlatList
        data={visits}
        keyExtractor={(item) => item.id}
        renderItem={renderOutletItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTodayRoute() }} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Aucune visite planifiée</Text>
            <Text style={styles.emptySubtitle}>Votre route du jour apparaîtra ici</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  summary: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusDot: {
    marginRight: 12,
    marginTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  dotCompleted: {
    backgroundColor: Colors.success,
  },
  dotInProgress: {
    backgroundColor: Colors.warning,
  },
  cardInfo: {
    flex: 1,
  },
  outletName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  outletAddress: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  outletChannel: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  checkinButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  checkinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  inProgressBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  inProgressText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  completedText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
})
