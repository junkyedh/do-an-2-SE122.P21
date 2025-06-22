import React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MainApiRequest } from "@/services/MainApiRequest"
import Breadcrumbs from "@/components/littleComponent/Breadcrumbs/Breadcrumbs"
import "./TrackingOrder.scss"
import { Clock, CheckCircle, Truck, MapPin, Phone, Mail, ArrowLeft, Package, CreditCard } from "lucide-react"

// Import custom components
import { Button } from "@/components/littleComponent/Button/Button"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/littleComponent/Card/Card"

interface RawOrder {
  id: number
  phoneCustomer: string
  serviceType: "TAKE AWAY" | "DINE IN"
  branchId: number
  orderDate: string
  status: string
  totalPrice?: number
  deliveryFee?: number
  discount?: number
  order_details: {
    productId: number
    size: string
    mood?: string
    quantity: number
  }[]
}

interface ProductDetail {
  id: number
  name: string
  image: string
  sizes: { sizeName: string; price: number }[]
}

interface OrderItem {
  productId: number
  name: string
  image: string
  size: string
  mood?: string
  quantity: number
  price: number
}

const statusMap: Record<
  string,
  {
    label: string
    color: string
    icon: React.ElementType
    description: string
    bgColor: string
  }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "#f97316",
    icon: Clock,
    description: "Đơn hàng đang chờ được xác nhận từ cửa hàng",
    bgColor: "linear-gradient(135deg, #fed7aa, #fdba74)",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "#3b82f6",
    icon: CheckCircle,
    description: "Đơn hàng đã được xác nhận và đang chuẩn bị",
    bgColor: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
  },
  PREPARING: {
    label: "Đang chuẩn bị",
    color: "#f59e0b",
    icon: Package,
    description: "Đang pha chế và chuẩn bị đồ uống của bạn",
    bgColor: "linear-gradient(135deg, #fef3c7, #fde68a)",
  },
  READY: {
    label: "Sẵn sàng",
    color: "#10b981",
    icon: CheckCircle,
    description: "Đơn hàng đã sẵn sàng để giao hoặc nhận",
    bgColor: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
  },
  DELIVERING: {
    label: "Đang giao",
    color: "#8b5cf6",
    icon: Truck,
    description: "Đơn hàng đang được giao đến địa chỉ của bạn",
    bgColor: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
  },
  COMPLETED: {
    label: "Hoàn thành",
    color: "#059669",
    icon: CheckCircle,
    description: "Đơn hàng đã được giao thành công",
    bgColor: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "#ef4444",
    icon: Clock,
    description: "Đơn hàng đã bị hủy",
    bgColor: "linear-gradient(135deg, #fee2e2, #fecaca)",
  },
}

export const TrackingOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<RawOrder | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] = useState("")
  const [custAddress, setCustAddress] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        let phoneNumber: string | undefined
        try {
          const prof = await MainApiRequest.get<{ data: { phone: string; name?: string; address?: string } }>(
            "/auth/callback",
          )
          phoneNumber = prof.data.data.phone
          setCustomerName(prof.data.data.name || "")
          setCustAddress(prof.data.data.address || "")
        } catch {
          const history: Array<{ orderId: number; phone: string }> = JSON.parse(
            localStorage.getItem("guest_order_history") || "[]",
          )
          const guestOrder = history.find((o) => String(o.orderId) === String(id))
          if (guestOrder) {
            phoneNumber = guestOrder.phone
            setCustomerName("Khách vãng lai")
            setCustAddress("")
          }
        }
        if (!phoneNumber) {
          setOrder(null)
          setLoading(false)
          return
        }

        const { data: o } = await MainApiRequest.get<RawOrder>(
          `/order/customer/${encodeURIComponent(phoneNumber)}/${id}`,
        )
        setOrder(o)

        const enriched = await Promise.all(
          o.order_details.map(async (d) => {
            const { data: p } = await MainApiRequest.get<ProductDetail>(`/product/${d.productId}`)
            const sz = p.sizes.find((s) => s.sizeName === d.size) || { sizeName: d.size, price: 0 }
            return {
              productId: p.id,
              name: p.name,
              image: p.image,
              size: d.size,
              mood: d.mood,
              quantity: d.quantity,
              price: sz.price,
            } as OrderItem
          }),
        )
        setItems(enriched)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) {
    return (
      <div className="tracking-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="tracking-container">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Không tìm thấy đơn hàng</h3>
          <p>Đơn hàng #{id} không tồn tại hoặc đã bị xóa</p>
          <Button variant="primary" icon={<ArrowLeft />} onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = statusMap[order.status] || {
    label: order.status,
    color: "#6b7280",
    icon: Clock,
    description: "",
    bgColor: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
  }
  const StatusIcon = statusInfo.icon

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = order.deliveryFee ?? (order.serviceType === "TAKE AWAY" ? 15000 : 0)
  const discount = order.discount || 0
  const total = subtotal + deliveryFee - discount

  const getProgressSteps = () => {
    const steps = [
      { key: "PENDING", label: "Chờ xác nhận" },
      { key: "CONFIRMED", label: "Đã xác nhận" },
      { key: "PREPARING", label: "Đang chuẩn bị" },
      { key: "READY", label: "Sẵn sàng" },
    ]

    if (order.serviceType === "TAKE AWAY") {
      steps.push({ key: "DELIVERING", label: "Đang giao" })
    }

    steps.push({ key: "COMPLETED", label: "Hoàn thành" })

    const currentIndex = steps.findIndex((step) => step.key === order.status)

    return steps.map((step, index) => ({
      ...step,
      completed: index < currentIndex,
      current: index === currentIndex,
      upcoming: index > currentIndex,
    }))
  }

  const progressSteps = getProgressSteps()

  return (
    <>
      <Breadcrumbs
        title="Theo dõi đơn hàng"
        items={[{ label: "Trang chủ", to: "/" }, { label: "Theo dõi đơn hàng" }]}
      />

      <div className="tracking-container">
        {/* Header */}
        <div className="tracking-header">
          <Button variant="secondary" icon={<ArrowLeft />} onClick={() => navigate("/")} className="back-btn">
            Trang chủ
          </Button>
          <div className="header-info">
            <h1 className="order-title">Đơn hàng #{order.id}</h1>
            <p className="order-date">Đặt lúc {new Date(order.orderDate).toLocaleString("vi-VN")}</p>
          </div>
        </div>

        <div className="tracking-content">
          {/* Left Column */}
          <div className="tracking-left">
            {/* Status Card */}
            <Card className="status-card">
              <CardBody>
                <div className="status-header">
                  <div className="status-icon-wrapper" style={{ background: statusInfo.bgColor }}>
                    <StatusIcon className="status-icon" style={{ color: statusInfo.color }} />
                  </div>
                  <div className="status-info">
                    <h2 className="status-title">{statusInfo.label}</h2>
                    <p className="status-description">{statusInfo.description}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Progress Timeline */}
            <Card className="timeline-card">
              <CardHeader>
                <CardTitle>Tiến trình đơn hàng</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="timeline">
                  {progressSteps.map((step, index) => (
                    <div
                      key={step.key}
                      className={`timeline-item ${step.completed ? "completed" : ""} ${step.current ? "current" : ""}`}
                    >
                      <div className="timeline-marker">
                        {step.completed ? (
                          <CheckCircle className="timeline-icon completed" />
                        ) : step.current ? (
                          <div className="timeline-icon current">
                            <div className="pulse-dot"></div>
                          </div>
                        ) : (
                          <div className="timeline-icon upcoming"></div>
                        )}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-label">{step.label}</div>
                        {step.current && (
                          <div className="timeline-time">{new Date(order.orderDate).toLocaleString("vi-VN")}</div>
                        )}
                      </div>
                      {index < progressSteps.length - 1 && (
                        <div className={`timeline-line ${step.completed ? "completed" : ""}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Customer Info */}
            <Card className="info-card">
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="info-list">
                  <div className="info-item">
                    <MapPin className="info-icon" />
                    <div className="info-content">
                      <div className="info-label">Địa chỉ</div>
                      <div className="info-value">
                        {order.serviceType === "DINE IN" ? "Nhận tại cửa hàng" : custAddress || "Địa chỉ giao hàng"}
                      </div>
                    </div>
                  </div>
                  <div className="info-item">
                    <Phone className="info-icon" />
                    <div className="info-content">
                      <div className="info-label">Số điện thoại</div>
                      <div className="info-value">{order.phoneCustomer}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <Mail className="info-icon" />
                    <div className="info-content">
                      <div className="info-label">Khách hàng</div>
                      <div className="info-value">{customerName}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <CreditCard className="info-icon" />
                    <div className="info-content">
                      <div className="info-label">Phương thức</div>
                      <div className="info-value">
                        {order.serviceType === "TAKE AWAY" ? "Giao hàng" : "Tại cửa hàng"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column */}
          <div className="tracking-right">
            {/* Order Items */}
            <Card className="items-card">
              <CardHeader>
                <CardTitle>Chi tiết đơn hàng</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="order-items">
                  {items.map((item) => (
                    <div key={item.productId} className="order-item">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-specs">
                          {item.size}
                          {item.mood && `, ${item.mood === "hot" ? "Nóng" : "Lạnh"}`}
                        </div>
                        <div className="item-quantity">Số lượng: {item.quantity}</div>
                      </div>
                      <div className="item-price">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Order Summary */}
            <Card className="summary-card">
              <CardHeader>
                <CardTitle>Tổng cộng</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="summary-breakdown">
                  <div className="summary-line">
                    <span className="summary-label">Tạm tính</span>
                    <span className="summary-value">{subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="summary-line">
                    <span className="summary-label">Phí giao hàng</span>
                    <span className="summary-value">{deliveryFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                  {discount > 0 && (
                    <div className="summary-line discount">
                      <span className="summary-label">Giảm giá</span>
                      <span className="summary-value">-{discount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  )}
                  <div className="summary-line total">
                    <span className="summary-label">Tổng cộng</span>
                    <span className="summary-value">{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Support Card */}
            <Card className="support-card">
              <CardHeader>
                <CardTitle>Cần hỗ trợ?</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="support-text">Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về đơn hàng</p>
                <div className="support-actions">
                  <Button variant="secondary" size="sm" icon={<Phone />}>
                    Gọi: 1900 1234
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Mail />}>
                    Email hỗ trợ
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
