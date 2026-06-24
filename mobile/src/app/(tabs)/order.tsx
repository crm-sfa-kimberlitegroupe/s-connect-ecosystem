import { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native'
import { ordersService } from '../../services/orders.service'
import { Colors } from '../../constants/theme'
import type { Product, OrderItem } from '../../types'

export default function OrderScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Map<string, { product: Product; quantity: number }>>(new Map())
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await ordersService.getProducts()
        setProducts(data)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  function addToCart(product: Product) {
    const newCart = new Map(cart)
    const existing = newCart.get(product.id)
    if (existing) {
      newCart.set(product.id, { product, quantity: existing.quantity + 1 })
    } else {
      newCart.set(product.id, { product, quantity: 1 })
    }
    setCart(newCart)
  }

  function removeFromCart(productId: string) {
    const newCart = new Map(cart)
    const existing = newCart.get(productId)
    if (existing && existing.quantity > 1) {
      newCart.set(productId, { ...existing, quantity: existing.quantity - 1 })
    } else {
      newCart.delete(productId)
    }
    setCart(newCart)
  }

  async function submitOrder() {
    if (cart.size === 0) {
      Alert.alert('Panier vide', 'Ajoutez des produits avant de soumettre')
      return
    }

    setSubmitting(true)
    try {
      const items: Omit<OrderItem, 'id' | 'totalPrice' | 'product'>[] = Array.from(cart.values()).map(
        ({ product, quantity }) => ({
          productId: product.id,
          quantity,
          unitPrice: product.price,
        }),
      )
      // TODO: pass actual outletId from current visit context
      await ordersService.create('current-outlet-id', items)
      Alert.alert('Commande soumise', 'Votre commande a été envoyée avec succès')
      setCart(new Map())
    } catch {
      Alert.alert('Erreur', 'Impossible de soumettre la commande')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  )

  const totalAmount = Array.from(cart.values()).reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  )

  function renderProduct({ item }: { item: Product }) {
    const cartItem = cart.get(item.id)
    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productSku}>{item.sku}</Text>
          <Text style={styles.productPrice}>
            {item.price.toLocaleString('fr-FR')} FCFA
          </Text>
        </View>
        <View style={styles.quantityControls}>
          {cartItem ? (
            <>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => removeFromCart(item.id)}
              >
                <Text style={styles.qtyButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{cartItem.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>Ajouter</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>
              {loading ? 'Chargement...' : 'Aucun produit trouvé'}
            </Text>
          </View>
        }
      />

      {cart.size > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.cartSummary}>
            <Text style={styles.cartItems}>{cart.size} article(s)</Text>
            <Text style={styles.cartTotal}>
              {totalAmount.toLocaleString('fr-FR')} FCFA
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.buttonDisabled]}
            onPress={submitOrder}
            disabled={submitting}
          >
            <Text style={styles.submitText}>
              {submitting ? 'Envoi...' : 'Soumettre la commande'}
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
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  list: {
    padding: 16,
    gap: 10,
    paddingBottom: 120,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  productSku: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  cartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItems: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  submitButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
})
