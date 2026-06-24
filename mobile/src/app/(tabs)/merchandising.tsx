import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Colors } from '../../constants/theme'

interface Photo {
  uri: string
  timestamp: number
  type: string
}

export default function MerchandisingScreen() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Accès à la caméra nécessaire')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false,
    })

    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [
        ...prev,
        {
          uri: result.assets[0].uri,
          timestamp: Date.now(),
          type: 'SHELF',
        },
      ])
    }
  }

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Accès à la galerie nécessaire')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    })

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => ({
        uri: asset.uri,
        timestamp: Date.now(),
        type: 'SHELF',
      }))
      setPhotos((prev) => [...prev, ...newPhotos])
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  async function uploadPhotos() {
    if (photos.length === 0) {
      Alert.alert('Aucune photo', 'Prenez des photos avant de les envoyer')
      return
    }

    setUploading(true)
    try {
      // TODO: Upload to backend via multipart form
      await new Promise((resolve) => setTimeout(resolve, 2000))
      Alert.alert('Photos envoyées', `${photos.length} photo(s) uploadée(s) avec succès`)
      setPhotos([])
    } catch {
      Alert.alert('Erreur', "Impossible d'envoyer les photos")
    } finally {
      setUploading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Photos Merchandising</Text>
          <Text style={styles.headerSubtitle}>
            Prenez des photos des rayons pour le suivi merchandising
          </Text>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={styles.captureIcon}>📸</Text>
            <Text style={styles.captureText}>Prendre photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
            <Text style={styles.captureIcon}>🖼️</Text>
            <Text style={styles.galleryText}>Galerie</Text>
          </TouchableOpacity>
        </View>

        {photos.length > 0 && (
          <View style={styles.photosSection}>
            <Text style={styles.sectionTitle}>
              {photos.length} photo(s) prête(s)
            </Text>
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <View key={`${photo.timestamp}-${index}`} style={styles.photoCard}>
                  <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {photos.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📷</Text>
            <Text style={styles.emptyTitle}>Aucune photo</Text>
            <Text style={styles.emptySubtitle}>
              Capturez les rayons et présentoirs du point de vente
            </Text>
          </View>
        )}
      </ScrollView>

      {photos.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.uploadButton, uploading && styles.buttonDisabled]}
            onPress={uploadPhotos}
            disabled={uploading}
          >
            <Text style={styles.uploadText}>
              {uploading ? 'Envoi en cours...' : `Envoyer ${photos.length} photo(s)`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  header: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  captureButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  galleryButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  captureIcon: {
    fontSize: 28,
  },
  captureText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  galleryText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  photosSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoCard: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
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
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  uploadButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
