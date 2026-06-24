import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { visitsService } from '../../services/visits.service'
import { Colors } from '../../constants/theme'
import type { Visit } from '../../types'

export default function VisitScreen() {
  const router = useRouter()
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  useEffect(() => {
    async function loadCurrentVisit() {
      try {
        const visits = await visitsService.getTodayVisits()
        const inProgress = visits.find((v) => v.status === 'IN_PROGRESS')
        if (inProgress) {
          setCurrentVisit(inProgress)
        }
      } catch {
        // Offline or API unavailable
      } finally {
        setLoading(false)
      }
    }

    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({})
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        })
      }
    }

    loadCurrentVisit()
    getLocation()
  }, [])

  async function handleCheckout() {
    if (!currentVisit) return

    setCheckoutLoading(true)
    try {
      await visitsService.checkout(currentVisit.id, notes || undefined)
      Alert.alert('Check-out réussi', 'Visite terminée avec succès', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ])
    } catch {
      Alert.alert('Erreur', 'Impossible de faire le check-out')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    )
  }

  if (!currentVisit) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>📍</Text>
        <Text style={styles.emptyTitle}>Aucune visite en cours</Text>
        <Text style={styles.emptySubtitle}>
          Faites un check-in depuis la Route du jour
        </Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.goBackText}>Voir la route</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const duration = currentVisit.checkinAt
    ? Math.floor((Date.now() - new Date(currentVisit.checkinAt).getTime()) / 60000)
    : 0

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.visitCard}>
        <View style={styles.visitHeader}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Visite en cours</Text>
        </View>

        <Text style={styles.outletName}>{currentVisit.outlet?.name || 'Point de Vente'}</Text>
        <Text style={styles.outletAddress}>{currentVisit.outlet?.address || ''}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Check-in</Text>
            <Text style={styles.metaValue}>
              {new Date(currentVisit.checkinAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Durée</Text>
            <Text style={styles.metaValue}>{duration} min</Text>
          </View>
          {location && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>GPS</Text>
              <Text style={styles.metaValue}>✓ Actif</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/order')}
          >
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionLabel}>Commande</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/merchandising')}
          >
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionLabel}>Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.sectionTitle}>Notes de visite</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Ajouter des notes sur cette visite..."
          placeholderTextColor={Colors.textSecondary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[styles.checkoutButton, checkoutLoading && styles.buttonDisabled]}
        onPress={handleCheckout}
        disabled={checkoutLoading}
      >
        <Text style={styles.checkoutText}>
          {checkoutLoading ? 'Check-out...' : 'Terminer la visite (Check-out)'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
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
    marginTop: 8,
    textAlign: 'center',
  },
  goBackButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  goBackText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  visitCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  visitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 8,
  },
  liveText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  outletName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  outletAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 24,
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  actionsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  notesSection: {
    gap: 8,
  },
  notesInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
  },
  checkoutButton: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
