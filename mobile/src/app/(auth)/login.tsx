import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authService } from '../../services/auth.service'
import { api } from '../../services/api'
import { Colors } from '../../constants/theme'

interface Tenant {
  id: string
  companyName: string
  industry: string
}

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    loadTenants()
  }, [])

  async function loadTenants() {
    try {
      const storedTenant = await AsyncStorage.getItem('tenantId')
      if (storedTenant) setTenantId(storedTenant)

      const data = await api.get<{ success: boolean; tenants: Tenant[] }>('/tenants/public/list')
      setTenants(data.tenants)
      if (!storedTenant && data.tenants.length === 1) {
        setTenantId(data.tenants[0].id)
      }
    } catch {
      // API unavailable, allow manual tenant ID input
    }
  }

  async function handleLogin() {
    if (!tenantId.trim()) {
      Alert.alert('Erreur', 'Veuillez sélectionner votre organisation')
      return
    }
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    try {
      await AsyncStorage.setItem('tenantId', tenantId)
      await authService.login(email.trim(), password)
      router.replace('/(tabs)')
    } catch {
      Alert.alert('Erreur de connexion', 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SalesConnect</Text>
          <Text style={styles.subtitle}>Application terrain REP</Text>
        </View>

        <View style={styles.form}>
          {/* Organization */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Organisation</Text>
            {tenants.length > 0 ? (
              <View style={styles.tenantList}>
                {tenants.map((tenant) => (
                  <TouchableOpacity
                    key={tenant.id}
                    style={[
                      styles.tenantOption,
                      tenantId === tenant.id && styles.tenantOptionActive,
                    ]}
                    onPress={() => setTenantId(tenant.id)}
                  >
                    <Text
                      style={[
                        styles.tenantOptionText,
                        tenantId === tenant.id && styles.tenantOptionTextActive,
                      ]}
                    >
                      {tenant.companyName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <TextInput
                style={styles.input}
                placeholder="ID Organisation (UUID)"
                placeholderTextColor={Colors.textSecondary}
                value={tenantId}
                onChangeText={setTenantId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              placeholderTextColor={Colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  tenantList: {
    gap: 8,
  },
  tenantOption: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  tenantOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: '#EBF8FF',
  },
  tenantOptionText: {
    fontSize: 15,
    color: Colors.text,
  },
  tenantOptionTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  eyeText: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
