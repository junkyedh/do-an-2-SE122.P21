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
interface ProductMaterial {
  name: string
}

/** Kiểu Product (trích từ BE) */
interface ProductSize {
  sizeName: string
  price: number
}
interface Product {
  id: string
  name: string
  category: string
  description?: ProductMaterial[]
  image: string
  available: boolean
  hot: boolean
  cold: boolean
  isPopular: boolean
  isNew: boolean
  sizes: ProductSize[]
  material: {name:string}[];
}

/** Kiểu sử dụng trong Context */
export interface CartItem {
  id: string
  productId: number
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
    productId: number ,
    size: string,
    quantity?: number,
    mood?: string,
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

  // Hàm tạo hoặc lấy sessionId từ localStorage
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
      // nếu user đã đăng nhập, lấy phone từ auth/callback và migrate cart
      let query  = `?sessionId=${sid}`
      try {
        const auth = await MainApiRequest.get<{ data: { phoneCustomer: string}}>('/auth/callback')
        const phone = auth.data.data.phoneCustomer
        if (phone) {
          //merge cart vao cart của user
          try {
            await MainApiRequest.post('/cart/migrate', {phoneCustomer: phone, sessionId: sid})
            query = `?phoneCustomer=${encodeURIComponent(phone)}`
          } catch (err) {
            console.error('Migrate cart failed', err)
          }
          query = `?phoneCustomer=${encodeURIComponent(phone)}`
        }
      } catch {}
      // 1) GET /cart voi dung query
      const res = await MainApiRequest.get<RawCartItem[]>(`/cart${query}`)
      const raw = res.data

      // 2) Với mỗi item, gọi API product để lấy thêm thông tin
      const enriched: CartItem[] = await Promise.all(
        raw.map(async (ci) => {
          const {data: p} = await MainApiRequest.get<Product>(`/product/${ci.productId}`)
          const isCake = p.category === 'Bánh ngọt'
          // tinh gia cho bánh ngọt
          let price: number
          if (isCake && ci.size === 'whole') {
            price = p.sizes[0].price * 8
          } else {
            // Tính giá tương ứng với size
            const sz = p.sizes.find((s) => s.sizeName === ci.size)
            price = sz?.price ?? 0
          }
          // Nếu không có size tương ứng, dùng giá đầu tiên
          if (price === 0 && p.sizes.length > 0) {
            price = p.sizes[0].price
          }

          //availableSizes: cake co them whole
          // map availableSizes dùng cho CartDrawer
          const availableSizes = isCake
            ? [
                { name: 'piece', price: p.sizes[0].price },
                { name: 'whole', price: p.sizes[0].price * 8 },
            ]
            : p.sizes.map((s) => ({ name: s.sizeName, price: s.price }))

          return {
            id: ci.id,
            productId: Number(ci.productId),
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
  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (
    productId: number,
    size: string,
    quantity: number = 1,
    mood?: string
  ) => {
    const sid = sessionId()
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const productIdNumber = Number(productId)
    const existingItem = cart.find(
      (item) => Number(item.productId) === productIdNumber && item.size === size && item.mood === mood
    )
    if (existingItem) {
      // Nếu đã có, chỉ cần cập nhật số lượng
      await updateItem(existingItem.id, { quantity: existingItem.quantity + quantity })
      return fetchCart()
    }
    // Nếu chưa có, thêm mới
    const payload: any = { 
      productId: productIdNumber, 
      size,
      mood,
      quantity,
      sessionId: sid,
    }
    console.log('Add to cart payload:', payload)
    // Nếu đã đăng nhập, lấy phone từ auth/callback
    try {
      const auth = await MainApiRequest.get<{ data: {phone: string}}>('/auth/callback')
      const phone = auth.data.data.phone
      if (phone) payload.phoneCustomer = phone
    } catch {}
    await MainApiRequest.post('/cart', payload)
     .catch((err) => {
      console.error('Add to cart failed', err.response?.data || err)
      throw err
    })
    // Cập nhật lại giỏ hàng
    await fetchCart()
  }

  // Cập nhật sản phẩm trong giỏ hàng
  const updateItem = async (
    id: string,
    updates: { quantity?: number; size?: string; mood?: string }
  ) => {
    try {
      const sid = sessionId()
      const payload: any = { ...updates, sessionId: sid }
      try {
        const auth = await MainApiRequest.get<{ data: {phoneCustomer: string}}>('/auth/callback')
        const phone = auth.data.data.phoneCustomer
        if (phone) payload.phoneCustomer = phone
      } catch {}
      await MainApiRequest.put(`/cart/${id}`, payload)
      await fetchCart()
    } catch (err) {
      console.error('Update cart item failed', err)
      throw err // ném lại để caller có thể xử lý
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = async (id: string) => {
    try {
      const sid = sessionId()
      let url = `/cart/${id}?sessionId=${sid}`
      try {
        const auth = await MainApiRequest.get<{ data: {phoneCustomer: string}}>('/auth/callback')
        const phone = auth.data.data.phoneCustomer
        if (phone) url = `/cart/${id}?phoneCustomer=${encodeURIComponent(phone)}`
      } catch {}
      await MainApiRequest.delete(url)
      await fetchCart()
    } catch (err) {
      console.error('Remove cart item failed', err)
      throw err // ném lại để caller có thể xử lý
    }
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      const sid = sessionId()
      let url = `/cart?sessionId=${sid}`
      try {
        const auth = await MainApiRequest.get<{ data: {phoneCustomer: string}}>('/auth/callback')
        const phone = auth.data.data.phoneCustomer
        if (phone) url = `/cart?phoneCustomer=${encodeURIComponent(phone)}`
      } catch (err) {
        console.error('Clear cart failed', err)
      }
      await MainApiRequest.delete(url)
      await fetchCart()
    } catch (err) {
      console.error('Clear cart failed', err)
      throw err // ném lại để caller có thể xử lý
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
