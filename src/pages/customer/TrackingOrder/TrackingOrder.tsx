// src/components/TrackingOrder/TrackingOrder.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { MainApiRequest } from '@/services/MainApiRequest';
import './TrackingOrder.scss';

interface RawOrder {
  id: number;
  phoneCustomer: string;
  serviceType: 'TAKE AWAY' | 'DINE IN';
  totalPrice?: number;
  branchId: number;
  orderDate: string;
  status: string;
  productIDs: number[];       // API chỉ trả mảng ID
  deliveryFee?: number;
  discount?: number;
  customerInfo?: {
    address?: string;
    email?: string;
    note?: string;
  };
  paymentMethod?: 'cash' | 'transfer';
}

interface ProductDetail {
  id: number;
  name: string;
  image: string;
  sizes: { sizeName: string; price: number }[];
}

interface OrderItem {
  id: number;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

const statusMap: Record<
  string,
  { label: string; color: string; icon: React.ComponentType; description: string }
> = {
  PENDING:    { label: 'Chờ xác nhận',     color: 'orange',    icon: Clock,       description: 'Đơn hàng đang chờ được xác nhận' },
  CONFIRMED:  { label: 'Đã xác nhận',       color: 'blue',      icon: CheckCircle, description: 'Đơn hàng đã được xác nhận và đang chuẩn bị' },
  PREPARING:  { label: 'Đang chuẩn bị',     color: 'orange',    icon: Clock,       description: 'Đang pha chế đồ uống của bạn' },
  READY:      { label: 'Sẵn sàng',          color: 'green',     icon: CheckCircle, description: 'Đơn hàng đã sẵn sàng để giao/nhận' },
  DELIVERING: { label: 'Đang giao hàng',   color: 'purple',    icon: Truck,       description: 'Đơn hàng đang được giao đến bạn' },
  COMPLETED:  { label: 'Hoàn thành',        color: 'green-dark',icon: CheckCircle, description: 'Đơn hàng đã được giao thành công' },
  CANCELLED:  { label: 'Đã hủy',            color: 'red',       icon: Clock,       description: 'Đơn hàng đã bị hủy' },
};

export const TrackingOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<RawOrder | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1) Lấy order thô
        const { data: o } = await MainApiRequest.get<RawOrder>(`/order/${id}`);
        setOrder(o);

        // 2) Đếm số lượng mỗi productId
        const counts: Record<number, number> = {};
        o.productIDs.forEach(pid => counts[pid] = (counts[pid]||0) + 1);

        // 3) Lấy chi tiết từng product
        const uniqueIds = Array.from(new Set(o.productIDs));
        const detailFetches = await Promise.all(
          uniqueIds.map(async pid => {
            const { data: p } = await MainApiRequest.get<ProductDetail>(`/product/${pid}`);
            // mình lấy size đầu tiên làm mặc định
            const sizeObj = p.sizes[0] || { sizeName: '', price: 0 };
            return {
              id: pid,
              name: p.name,
              image: p.image,
              size: sizeObj.sizeName,
              price: sizeObj.price,
              quantity: counts[pid],
            } as OrderItem;
          })
        );

        setItems(detailFetches);
      } catch (err) {
        console.error('Lỗi khi load đơn hàng', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div className="tracking-page">Đang tải...</div>;
  }
  if (!order) {
    return (
      <div className="tracking-page empty">
        <p>Không tìm thấy đơn hàng #{id}</p>
        <button className="back-home" onClick={() => navigate('/')}>
          ← Quay về trang chủ
        </button>
      </div>
    );
  }

  const info = statusMap[order.status] || {
    label: order.status,
    color: 'gray',
    icon: Clock,
    description: ''
  };
  const StatusIcon = info.icon;

  // timeline steps
  const steps = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    order.serviceType === 'DINE IN' ? null : 'DELIVERING',
    'COMPLETED'
  ].filter(Boolean) as string[];
  const currentStep = steps.findIndex(s => s === order.status);

  // Tính subtotal / phí / giảm
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = order.deliveryFee ?? (order.serviceType === 'TAKE AWAY' ? 0 : 15000);
  const discount = order.discount ?? 0;

  return (
    <div className="tracking-page">
      <header className="tracking-header">
        <button className="back-home" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Quay về trang chủ
        </button>
        <div>
          <h1>Theo dõi đơn hàng</h1>
          <p className="order-id">Mã đơn hàng: #{order.id}</p>
        </div>
      </header>

      <div className="tracking-content">
        <section className="left-col">
          {/* status */}
          <div className="card status-card">
            <div className="status-current">
              <div className={`icon-bg ${info.color}`}>
                <StatusIcon />
              </div>
              <div className="status-text">
                <h2>{info.label}</h2>
                <p>{info.description}</p>
              </div>
            </div>
            <ul className="status-timeline">
              {steps.map((step, i) => {
                const stepInfo = statusMap[step] || { label: step };
                const done = i < currentStep, active = i === currentStep;
                return (
                  <li key={step} className="timeline-item">
                    <div className={`marker ${done?'done':active?'active':''}`} />
                    <div className="label-section">
                      <span className={`${done?'done':active?'active':''}`}>{stepInfo.label}</span>
                      {active && (
                        <small className="timestamp">
                          {new Date(order.orderDate).toLocaleString('vi-VN')}
                        </small>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* shipping info */}
          <div className="card info-card">
            <h2>Thông tin giao hàng</h2>
            <div className="info-line"><MapPin size={18}/> <span>
              {order.serviceType==='DINE IN'?'Nhận tại cửa hàng':order.customerInfo?.address||'-'}
            </span></div>
            <div className="info-line"><Phone size={18}/> <span>{order.phoneCustomer}</span></div>
            {order.customerInfo?.email && (
              <div className="info-line"><Mail size={18}/> <span>{order.customerInfo.email}</span></div>
            )}
          </div>

          {/* payment */}
          <div className="card payment-card">
            <h2>Phương thức thanh toán</h2>
            <div className="info-line">
              {order.paymentMethod==='cash' ? (
                <><Clock size={18}/> <span>Tiền mặt (khi nhận hàng)</span></>
              ) : (
                <><CheckCircle size={18}/> <span>Chuyển khoản</span></>
              )}
            </div>
          </div>
        </section>

        <aside className="right-col">
          {/* order detail */}
          <div className="card summary-card">
            <h2>Chi tiết đơn hàng</h2>
            <ul className="order-list">
              {items.map(it=>(
                <li key={it.id} className="order-item">
                  <img src={it.image} alt={it.name}/>
                  <div className="desc">{it.name} ({it.size})</div>
                  <div className="qty">x{it.quantity}</div>
                  <div className="price">{(it.price*it.quantity).toLocaleString('vi-VN')}₫</div>
                </li>
              ))}
            </ul>
          </div>

          {/* totals */}
          <div className="card total-card">
            <h2>Tổng cộng</h2>
            <div className="line"><span>Tạm tính</span><span>{subtotal.toLocaleString('vi-VN')}₫</span></div>
            <div className="line"><span>Phí giao hàng</span><span>{deliveryFee.toLocaleString('vi-VN')}₫</span></div>
            {discount>0 && (
              <div className="line discount"><span>Giảm giá</span><span>-{discount.toLocaleString('vi-VN')}₫</span></div>
            )}
            <div className="line total-line">
              <strong>Tổng cộng</strong>
              <strong>{(subtotal+deliveryFee-discount).toLocaleString('vi-VN')}₫</strong>
            </div>
          </div>

          {/* support */}
          <div className="card support-card">
            <h2>Cần hỗ trợ?</h2>
            <p>Liên hệ với chúng tôi nếu có thắc mắc về đơn hàng</p>
            <button className="support-btn"><Phone size={16}/> 1900 1234</button>
            <button className="support-btn"><Mail size={16}/> support@cafecorp.com</button>
          </div>
        </aside>
      </div>
    </div>
  );
};
