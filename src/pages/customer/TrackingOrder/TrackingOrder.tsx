// src/components/TrackingOrder/TrackingOrder.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainApiRequest } from '@/services/MainApiRequest';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import './TrackingOrder.scss';
import { Clock, CheckCircle, Truck, MapPin, Phone, Mail } from 'lucide-react';

interface RawOrder {
  id: number;
  phoneCustomer: string;
  serviceType: 'TAKE AWAY' | 'DINE IN';
  branchId: number;
  orderDate: string;
  status: string;
  totalPrice?: number;
  deliveryFee?: number;
  discount?: number;
  order_details: {
    productId: number;
    size: string;
    mood?: string;
    quantity: number;
  }[];
}

interface ProductDetail {
  id: number;
  name: string;
  image: string;
  sizes: { sizeName: string; price: number }[];
}

interface OrderItem {
  productId: number;
  name: string;
  image: string;
  size: string;
  mood?: string;
  quantity: number;
  price: number;
}

const statusMap: Record<string, { label: string; color: string; icon: React.ComponentType; description: string }> = {
  PENDING:    { label: 'Chờ xác nhận', color: 'orange',    icon: Clock, description: 'Chờ xác nhận' },
  CONFIRMED:  { label: 'Đã xác nhận',   color: 'blue',      icon: CheckCircle, description: 'Đã xác nhận' },
  PREPARING:  { label: 'Đang chuẩn bị', color: 'orange',    icon: Clock, description: 'Đang chuẩn bị' },
  READY:      { label: 'Sẵn sàng',      color: 'green',     icon: CheckCircle, description: 'Đã sẵn sàng' },
  DELIVERING: { label: 'Đang giao',    color: 'purple',    icon: Truck, description: 'Đang giao' },
  COMPLETED:  { label: 'Hoàn thành',    color: 'green',     icon: CheckCircle, description: 'Hoàn thành' },
  CANCELLED:  { label: 'Đã hủy',        color: 'red',       icon: Clock, description: 'Đã hủy' },
};

export const TrackingOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<RawOrder | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [custName, setCustName] = useState('');
  const [custAddress, setCustAddress] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // 1) profile customer
        const prof = await MainApiRequest.get<{ data: { phone: string; name: string; address: string } }>('/auth/callback');
        setCustName(prof.data.data.name);
        setCustAddress(prof.data.data.address);

        // 2) fetch full order with details
        const { data: o } = await MainApiRequest.get<RawOrder>(`/order/${id}`);
        setOrder(o);

        // 3) enrich each detail
        const enriched = await Promise.all(
          o.order_details.map(async (d) => {
            const { data: p } = await MainApiRequest.get<ProductDetail>(`/product/${d.productId}`);
            const sz = p.sizes.find((s) => s.sizeName === d.size) || { sizeName: d.size, price: 0 };
            return {
              productId: p.id,
              name: p.name,
              image: p.image,
              size: d.size,
              mood: d.mood,
              quantity: d.quantity,
              price: sz.price,
            } as OrderItem;
          })
        );
        setItems(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="tracking-page">Đang tải...</div>;
  if (!order) {
    return (
      <div className="tracking-page empty">
        <p>Không tìm thấy đơn #{id}</p>
        <button onClick={() => navigate('/')}>← Trang chủ</button>
      </div>
    );
  }

  const info = statusMap[order.status] || { label: order.status, color: 'gray', icon: Clock, description: '' };
  const Icon = info.icon;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = order.deliveryFee ?? (order.serviceType === 'TAKE AWAY' ? 0 : 15000);
  const discount = order.discount || 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="tracking-page">
      <Breadcrumbs title="Theo dõi đơn" items={[{ label: 'Trang chủ', to: '/' }, { label: 'Theo dõi đơn' }]} />

      <header className="tracking-header">
        <button onClick={() => navigate('/')}>← Trang chủ</button>
        <button onClick={() => navigate('/history')}>← Lịch sử</button>
        <h1>Đơn #{order.id}</h1>
      </header>

      <div className="tracking-content">
        <aside className="left-col">
          <div className="card status-card">
            <div className="icon-bg" style={{ background: info.color }}>
              <Icon />
            </div>
            <h2>{info.label}</h2>
            <p>{info.description}</p>
          </div>

          <div className="card info-card">
            <h2>Thông tin</h2>
            <p>
              <MapPin />{' '}
              {order.serviceType === 'DINE IN' ? 'Nhận tại cửa hàng' : custAddress}
            </p>
            <p>
              <Phone /> {order.phoneCustomer}
            </p>
            <p>
              <Mail /> {custName}
            </p>
          </div>
        </aside>

        <aside className="right-col">
          <div className="card summary-card">
            <h2>Chi tiết đơn</h2>
            {items.map((it) => (
              <div key={it.productId} className="item">
                <img src={it.image} alt={it.name} />
                <div>
                  {it.name} ({it.size}
                  {it.mood ? `, ${it.mood}` : ''}) x{it.quantity}
                </div>
                <div>{(it.price * it.quantity).toLocaleString('vi-VN')}₫</div>
              </div>
            ))}
          </div>

          <div className="card total-card">
            <h2>Tổng cộng</h2>
            <div>
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div>
              <span>Phí giao</span>
              <span>{deliveryFee.toLocaleString('vi-VN')}₫</span>
            </div>
            {discount > 0 && (
              <div>
                <span>Giảm</span>
                <span>-{discount.toLocaleString('vi-VN')}₫</span>
              </div>
            )}
            <div>
              <strong>Tổng</strong>
              <strong>{total.toLocaleString('vi-VN')}₫</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
