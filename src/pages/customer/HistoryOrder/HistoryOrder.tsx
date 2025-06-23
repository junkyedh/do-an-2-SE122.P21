import React from "react"
import { useEffect, useState } from "react"
import "./HistoryOrder.scss"
import Breadcrumbs from "@/components/littleComponent/Breadcrumbs/Breadcrumbs"
import { MainApiRequest } from "@/services/MainApiRequest"
import { Clock, CheckCircle, Truck, Star, Eye, Calendar } from "lucide-react"

// Import custom components
import { Button } from "@/components/littleComponent/Button/Button"
import { Card, CardBody } from "@/components/littleComponent/Card/Card"
import { Modal, ModalBody, ModalFooter } from "@/components/littleComponent/Modal/Modal"
import { Textarea } from "@/components/littleComponent/Textarea/Textarea"
import { useToast } from "@/components/littleComponent/Toast/Toast"
import { Search as SearchComponent } from "@/components/littleComponent/Search/Search"
import { Form, message } from "antd"
import { useNavigate } from "react-router-dom"
import { FaEye, FaStar } from "react-icons/fa"

interface OrderSummary {
  id: number
  serviceType: "TAKE AWAY" | "DINE IN"
  orderDate: string
  status: string
  branchId: number
  branchName?: string
  productIDs: (number | null)[]
}

interface OrderDetail {
  productId: number
  name: string
  image: string
  size: string
  mood?: string
  quantity: number
  price: number
}

interface ProductDetail {
  id: number
  name: string
  image: string
  sizes: {
    sizeName: string
    price: number
  }[]
}

const statusMap: Record<string, { label: string; color: string; icon: React.ComponentType }> = {
  PENDING: { label: "Chờ xác nhận", color: "orange", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", color: "blue", icon: CheckCircle },
  PREPARING: { label: "Đang chuẩn bị", color: "orange", icon: Clock },
  READY: { label: "Sẵn sàng", color: "green", icon: CheckCircle },
  DELIVERING: { label: "Đang giao", color: "purple", icon: Truck },
  COMPLETED: { label: "Hoàn thành", color: "green", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "red", icon: Clock },
}

const HistoryOrder: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderSummary[]>([])
  const [details, setDetails] = useState<Record<number, OrderDetail[]>>({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const [ratingModalVisible, setRatingModalVisible] = useState(false)
  const [currentProd, setCurrentProd] = useState<OrderDetail | null>(null)
  const [star, setStar] = useState(5)
  const [comment, setComment] = useState("")
  const [phone, setPhone] = useState<string>("")
  const [form] = Form.useForm()
  const [guestHistory, setGuestHistory] = useState<{ orderId: number; phone: string }[] | null>(null)

  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    MainApiRequest.get<{ msg: string; data: { phone: string } }>("/auth/callback")
      .then((r) => {
        const phone = r.data.data.phone
        setPhone(phone)
        setGuestHistory(null)
      })
      .catch(() => {
        const history = JSON.parse(localStorage.getItem("guest_order_history") || "[]")
        setGuestHistory(history)
        if (history.length > 0) {
          setPhone(history[0].phone)
        }
      })
  }, [])

  useEffect(() => {
    if (phone) {
      setLoading(true)
      MainApiRequest.get<OrderSummary[]>(`/order/customer/${encodeURIComponent(phone)}`)
        .then((r) => {
          setOrders(r.data)
          setFilteredOrders(r.data)
        })
        .catch((err) => {
          console.error(err)
          message.error("Không tải được lịch sử đơn hàng")
        })
        .finally(() => setLoading(false))
    } else if (guestHistory) {
      if (!guestHistory.length) return setOrders([])
      setLoading(true)
      Promise.all(
        guestHistory.map(async ({ orderId, phone }) => {
          try {
            const { data: order } = await MainApiRequest.get<any>(
              `/order/customer/${encodeURIComponent(phone)}/${orderId}`,
            )
            return {
              id: order.id,
              serviceType: order.serviceType,
              orderDate: order.orderDate,
              status: order.status,
              branchId: order.branchId,
              branchName: order.branchName,
              productIDs: order.order_details?.map((d: any) => d.productId) || [],
            } as OrderSummary
          } catch {
            return null
          }
        }),
      )
        .then((res) => {
          const validOrders = res.filter(Boolean) as OrderSummary[]
          setOrders(validOrders)
          setFilteredOrders(validOrders)
        })
        .finally(() => setLoading(false))
    }
  }, [phone, guestHistory])

  useEffect(() => {
    if (!orders.length) return
    orders.forEach((order) => fetchDetails(order.id))
  }, [orders])

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.branchName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const fetchDetails = async (orderId: number) => {
    if (details[orderId]) return
    try {
      const res = await MainApiRequest.get<{
        order_details: {
          productId: number
          size: string
          mood?: string
          quantity: number
        }[]
      }>(`/order/customer/${encodeURIComponent(phone)}/${orderId}`)
      const rawDetails = res.data.order_details

      const enriched = await Promise.all(
        rawDetails.map(async (d) => {
          const { data: p } = await MainApiRequest.get<ProductDetail>(`/product/${d.productId}`)
          const sz = p.sizes.find((s) => s.sizeName === d.size) || { sizeName: d.size, price: 0 }
          return {
            productId: p.id,
            name: p.name,
            image: p.image,
            size: sz.sizeName,
            mood: d.mood,
            quantity: d.quantity,
            price: sz.price,
          } as OrderDetail
        }),
      )
      setDetails((prev) => ({ ...prev, [orderId]: enriched }))
    } catch (err) {
      console.error(err)
      message.error("Không tải được chi tiết đơn")
    }
  }

  const openRating = (prod: OrderDetail) => {
    setCurrentProd(prod)
    setStar(5)
    setComment("")
    form.resetFields()
    setRatingModalVisible(true)
  }

  const submitRating = async () => {
    if (!currentProd) return
    try {
      await MainApiRequest.post("/ratings", {
        phoneCustomer: phone,
        productId: currentProd.productId,
        description: comment,
        star,
      })
      toast.success("Cảm ơn đánh giá của bạn!")
      setRatingModalVisible(false)
    } catch (err) {
      console.error(err)
      toast.error("Gửi đánh giá thất bại")
    }
  }

  const getStatusBadge = (status: string) => {
    const info = statusMap[status] || { label: status, color: "gray", icon: Clock }
    return (
      <div className={`status-badge status-${info.color}`}>
        {React.createElement(info.icon as React.ElementType, { className: "status-icon" })}
        <span>{info.label}</span>
      </div>
    )
  }

  const uniqueStatuses = Array.from(new Set(orders.map((order) => order.status)))

  return (
    <>
      <Breadcrumbs title="Lịch sử đơn hàng" items={[{ label: "Trang chủ", to: "/" }, { label: "Lịch sử đơn" }]} />

      <div className="history-order-container">
        <div className="history-header">
          <h1 className="page-title">Lịch sử đơn hàng</h1>
          <p className="page-subtitle">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <SearchComponent
            placeholder="Tìm kiếm theo mã đơn hoặc chi nhánh..."
            value={searchTerm}
            onChange={setSearchTerm}
            fullWidth
          />

          <div className="status-filters">
            <Button
              variant={statusFilter === "all" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Tất cả ({orders.length})
            </Button>
            {uniqueStatuses.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "primary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {statusMap[status]?.label || status} ({orders.filter((o) => o.status === status).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải lịch sử đơn hàng...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Không có đơn hàng nào</h3>
              <p>Bạn chưa có đơn hàng nào phù hợp với bộ lọc</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="order-card">
                <CardBody>
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-id">Đơn hàng #{order.id}</h3>
                      <div className="order-meta">
                        <span className="order-date">
                          <Calendar className="meta-icon" />
                          {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="order-branch">{order.branchName || "Chi nhánh không xác định"}</span>
                        <span className="order-type">
                          {order.serviceType === "TAKE AWAY" ? "Giao hàng" : "Tại cửa hàng"}
                        </span>
                      </div>
                    </div>
                    <div className="order-status">{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="order-body">
                    <div className="order-items">
                      {(details[order.id] || []).slice(0, 3).map((item) => (
                        <div key={item.productId} className="order-item-preview">
                          <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-details">
                              {item.size}
                              {item.mood ? `, ${item.mood === "hot" ? "Nóng" : "Lạnh"}` : ""} × {item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                      {(details[order.id] || []).length > 3 && (
                        <div className="more-items">+{(details[order.id] || []).length - 3} sản phẩm khác</div>
                      )}
                    </div>

                    <div className="order-summary">
                      <div className="order-total">
                        <span className="total-label">Tổng tiền:</span>
                        <span className="total-amount">
                          {(details[order.id] || [])
                            .reduce((sum, item) => sum + item.price * item.quantity, 0)
                            .toLocaleString("vi-VN")}
                          ₫
                        </span>
                      </div>
                      <div className="order-actions">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<FaEye />}
                          onClick={() => window.open(`/tracking-order/${order.id}`, "_blank")}
                        >
                          Xem chi tiết
                        </Button>
                        {/* {order.status === "COMPLETED" && (
                          <Button
                            variant="accent"
                            size="sm"
                            icon={<Star />}
                            onClick={() => navigate(`/feedback?orderId=${order.id}`)}
                          >
                            Đánh giá
                          </Button>
                        )} */}
                      </div>
                    </div>
                  </div>

                  {/* Expandable details */}
                  <div className="order-details">
                    <details>
                      <summary className="details-toggle">Xem chi tiết đơn hàng</summary>
                      <div className="details-content">
                        {(details[order.id] || []).map((item) => (
                          <div key={item.productId} className="detail-item">
                            <img src={item.image || "/placeholder.svg"} alt={item.name} className="detail-image" />
                            <div className="detail-info">
                              <div className="detail-name">{item.name}</div>
                              <div className="detail-specs">
                                Size: {item.size}
                                {item.mood && `, ${item.mood === "hot" ? "Nóng" : "Lạnh"}`}
                              </div>
                              <div className="detail-quantity">Số lượng: {item.quantity}</div>
                              <div className="detail-price">
                                Giá: {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                              </div>
                            </div>
                            {order.status === "COMPLETED" && (
                              <Button variant="primary" size="sm" icon={<FaStar />} 
                                onClick={() => navigate(`/feedback?orderId=${order.id}&productId=${item.productId}`)}
                              >
                                Đánh giá
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Rating Modal */}
        {/* <Modal
          isOpen={ratingModalVisible}
          onClose={() => setRatingModalVisible(false)}
          title={`Đánh giá "${currentProd?.name}"`}
          size="md"
        >
          <ModalBody>
            <div className="rating-form">
              <div className="form-group">
                <label className="form-label">Số sao đánh giá</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`star-btn ${rating <= star ? "active" : ""}`}
                      onClick={() => setStar(rating)}
                    >
                      <Star />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                label="Nhận xét của bạn"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                fullWidth
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setRatingModalVisible(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={submitRating}>
              Gửi đánh giá
            </Button>
          </ModalFooter>
        </Modal> */}
      </div>
    </>
  )
}

export default HistoryOrder
