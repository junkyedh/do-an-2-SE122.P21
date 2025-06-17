import React, { useState, useEffect } from 'react'
import { Offcanvas, Button, Form, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useCart, CartItem } from '@/hooks/cartContext'
import './CartDrawer.scss'

const CartDrawer: React.FC = () => {
  const { cart, totalItems, totalPrice, updateItem, removeItem } = useCart()
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const open = () => setShow(true)
  const close = () => setShow(false)

  const handleCheckout = () => {
    close()
    navigate('/checkout', {
      state: {
        initialItems: cart.map(i => ({
          productId: i.id,
          size: i.size,
          mood: i.mood,
          quantity: i.quantity,
        }))
      }
    })
  }

  // helpers
  const isCake = (item: CartItem) => item.category === 'Bánh ngọt'
  const isDrink = (item: CartItem) =>
    ['Cà phê', 'Trà'].includes(item.category)

  return (
    <>
      <Button variant="outline-secondary" onClick={open} className="cart-trigger">
        🛒 <span className="badge">{totalItems}</span>
      </Button>

      <Offcanvas show={show} onHide={close} placement="end" className="cart-drawer">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Giỏ hàng ({totalItems})</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cart.length === 0 ? (
            <div className="empty-state">
              <Image src="/placeholder-empty.svg" alt="empty" width={100} height={100} />
              <p>Giỏ hàng trống</p>
              <Button onClick={close}>Tiếp tục mua sắm</Button>
            </div>
          ) : (
            <>
              <div className="items-list">
                {cart.map(item => (
                  <div key={item.id + item.size + (item.mood||'')} className="cart-item">
                    <div
                      className="thumb"
                      onClick={() => {
                        close()
                        navigate(`/product/${item.id}`)
                      }}
                    >
                      <Image src={item.image} alt={item.name} width={80} height={80} />
                    </div>
                    <div className="info">
                      <h5
                        onClick={() => {
                          close()
                          navigate(`/product/${item.id}`)
                        }}
                      >
                        {item.name}
                      </h5>

                      <div className="controls">
                        {/* Size */}
                        <Form.Select
                          value={item.size}
                          onChange={e => updateItem(item.id, { size: e.target.value })}
                          className="control-select"
                        >
                          {isCake(item)
                            ? [
                                { name: 'piece', label: '1 miếng' },
                                { name: 'whole', label: 'Cả bánh' }
                              ].map(opt => (
                                <option key={opt.name} value={opt.name}>
                                  {opt.label}
                                </option>
                              ))
                            : item.availableSizes?.map(s => (
                                <option key={s.name} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                        </Form.Select>

                        {/* Mood (nếu cà phê/trà) */}
                        {isDrink(item) && (
                          <Form.Select
                            value={item.mood}
                            onChange={e => updateItem(item.id, { mood: e.target.value })}
                            className="control-select"
                          >
                            <option value="hot">🔥 Nóng</option>
                            <option value="cold">🧊 Đá</option>
                          </Form.Select>
                        )}

                        {/* Quantity */}
                        <div className="qty-controls">
                          <Button
                            size="sm"
                            onClick={() =>
                              updateItem(item.id, {
                                quantity: Math.max(1, item.quantity - 1)
                              })
                            }
                          >
                            −
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateItem(item.id, { quantity: item.quantity + 1 })
                            }
                          >
                            ＋
                          </Button>
                        </div>

                        {/* Remove */}
                        <Button
                          variant="link"
                          size="sm"
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                    <div className="price">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary">
                <div className="line">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="line">
                  <span>Phí giao hàng</span>
                  <span>15.000₫</span>
                </div>
                <div className="line total">
                  <strong>Tổng cộng</strong>
                  <strong>{(totalPrice + 15000).toLocaleString('vi-VN')}₫</strong>
                </div>
                <Button className="w-100 btn-checkout" onClick={handleCheckout}>
                  Thanh toán
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default CartDrawer
