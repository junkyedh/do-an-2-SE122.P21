// src/hooks/cartContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { MainApiRequest } from '@/services/MainApiRequest'

/** Kiểu trả về từ API /cart */
interface RawCartItem {
  id: string       // id của bản ghi cart
  productId: string
  size: string
  mood?: string
  quantity: number
}

/** Kiểu Product (trích từ BE) */
interface ProductSize {
  sizeName: string
  price: number
}
interface Product {
  id: string
  name: string
  image: string
  category: string
  sizes: ProductSize[]
}

/** Kiểu sử dụng trong Context */
export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  category: string
  price: number
  quantity: number
  size: string
  mood?: string
  availableSizes: { name: string; price: number }[]
}

interface CartContextValue {
  cart: CartItem[]
  totalItems: number
  totalPrice: number
  fetchCart: () => Promise<void>
  addToCart: (
    productId: string,
    size: string,
    quantity?: number,
    mood?: string,
    phoneCustomer?: string
  ) => Promise<void>
  updateItem: (
    id: string,
    updates: { quantity?: number; size?: string; mood?: string }
  ) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  // Sinh hoặc lấy sessionId
  const sessionId = () => {
    let sid = localStorage.getItem('sessionId')
    if (!sid) {
      sid = crypto.randomUUID()
      localStorage.setItem('sessionId', sid)
    }
    return sid
  }

  // Lấy giỏ từ backend rồi enrich bằng product detail
  const fetchCart = async () => {
    try {
      const sid = sessionId()
      // 1) GET /cart
      const res = await MainApiRequest.get<RawCartItem[]>(`/cart?sessionId=${sid}`)
      const raw = res.data

      // 2) Với mỗi item, gọi API product để lấy thêm thông tin
      const enriched: CartItem[] = await Promise.all(
        raw.map(async (ci) => {
          const prodRes = await MainApiRequest.get<Product>(`/product/${ci.productId}`)
          const p = prodRes.data

          // Tính giá tương ứng với size
          const sz = p.sizes.find((s) => s.sizeName === ci.size)
          const price = sz?.price ?? 0

          // map availableSizes dùng cho CartDrawer
          const availableSizes = p.sizes.map((s) => ({
            name: s.sizeName,
            price: s.price,
          }))

          return {
            id: ci.id,
            productId: ci.productId,
            name: p.name,
            image: p.image,
            category: p.category,
            size: ci.size,
            mood: ci.mood,
            quantity: ci.quantity,
            price,
            availableSizes,
          }
        })
      )

      setCart(enriched)
    } catch (err) {
      console.error('Fetch cart failed', err)
    }
  }

  const addToCart = async (
    productId: string,
    size: string,
    quantity = 1,
    mood?: string,
    phoneCustomer?: string
  ) => {
    try {
      const sid = sessionId()
      await MainApiRequest.post('/cart', {
        productId,
        size,
        mood,
        quantity,
        phoneCustomer,
        sessionId: sid,
      })
      await fetchCart()
    } catch (err) {
      console.error('Add to cart failed', err)
    }
  }

  const updateItem = async (
    id: string,
    updates: { quantity?: number; size?: string; mood?: string }
  ) => {
    try {
      await MainApiRequest.put(`/cart/${id}`, updates)
      await fetchCart()
    } catch (err) {
      console.error('Update cart item failed', err)
    }
  }

  const removeItem = async (id: string) => {
    try {
      await MainApiRequest.delete(`/cart/${id}`)
      await fetchCart()
    } catch (err) {
      console.error('Remove from cart failed', err)
    }
  }

  const clearCart = async () => {
    try {
      const sid = sessionId()
      await MainApiRequest.delete(`/cart?sessionId=${sid}`)
      await fetchCart()
    } catch (err) {
      console.error('Clear cart failed', err)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cart, totalItems, totalPrice, fetchCart, addToCart, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
