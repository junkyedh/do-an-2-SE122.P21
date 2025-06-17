import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.scss';
import { MainApiRequest } from '@/services/MainApiRequest';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

interface LocationStateItem {
  productId: string;
  size: string;
  quantity: number;
  mood?: string;
}

interface ProductDetail {
  id: string;
  name: string;
  image: string;
  sizes: { sizeName: string; price: number }[];
}

interface OrderItem extends ProductDetail {
  quantity: number;
  size: string;
  price: number;
  mood?: string;
}

interface Coupon {
  code: string;
  discount: number;
  description: string;
}

export const Checkout: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Order items
  const [items, setItems] = useState<OrderItem[]>([]);
  // Customer info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  // Methods
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  // Coupons
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const availableCoupons: Coupon[] = [
    { code: 'WELCOME10', discount: 10000, description: 'Giảm 10k cho đơn hàng đầu tiên' },
    { code: 'FREESHIP', discount: 15000, description: 'Miễn phí giao hàng' },
    { code: 'SAVE20', discount: 20000, description: 'Giảm 20k cho đơn hàng từ 100k' },
  ];

  // Load items from state
  useEffect(() => {
    (async () => {
      const list = state?.initialItems || [];
    const data: OrderItem[] = await Promise.all(
      list.map(async (it: LocationStateItem): Promise<OrderItem> => {
        const res = await MainApiRequest.get<ProductDetail>(`/product/${it.productId}`);
        const sizeObj = res.data.sizes.find((s: { sizeName: string; price: number }) => s.sizeName === it.size);
        return {
        ...res.data,
        quantity: it.quantity,
        size: it.size,
        mood: it.mood,
        price: sizeObj?.price ?? 0,
        };
      })
    );
      setItems(data);
    })();
  }, [state]);

  // Try to auto-fill phone (logged-in)
  useEffect(() => {
    (async () => {
      try {
        const res = await MainApiRequest.get<{ phoneCustomer: string }>('/auth/callback');
        if (res.data.phoneCustomer) {
          setPhone(res.data.phoneCustomer);
        }
      } catch {}
    })();
  }, []);

  const deliveryFee = deliveryMethod === 'delivery' ? 15000 : 0;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = appliedCoupon?.discount ?? 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    const c = availableCoupons.find(c => c.code === couponCode.toUpperCase());
    if (c) setAppliedCoupon(c);
    else alert('Mã giảm giá không hợp lệ!');
  };

  const handlePlaceOrder = async () => {
    if (!name.trim() || !phone.trim()) {
      alert('Vui lòng nhập đầy đủ họ tên và số điện thoại');
      return;
    }
    try {
      const payload = {
        phoneCustomer: phone,
        serviceType: deliveryMethod === 'delivery' ? 'DINE IN' : 'TAKE AWAY',
        orderDate: new Date().toISOString(),
        status: 'PENDING',
        productIDs: items.map(i => parseInt(i.id, 10)),
        branchId: 1,
      };
      const res = await MainApiRequest.post<{ id: number }>('/order', payload);
      navigate(`/tracking-order/${res.data.id}`, { replace: true });
    } catch (err) {
      console.error(err);
      alert('Đặt hàng thất bại, vui lòng thử lại.');
    }
  };

  return (
    <>
    <Breadcrumbs
        title="Thanh toán"
        items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Giỏ hàng', to: '/cart' },
            { label: 'Thanh toán' }
        ]}
    />
    <div className="checkout-grid">
      {/* ==== CỘT TRÁI ==== */}
      <div className="left-col">
        <div className="card">
          <h2>Thông tin khách hàng</h2>
          <div className="row">
            <div className="field">
              <label>Họ và tên *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Nhập họ và tên" />
            </div>
            <div className="field">
              <label>Số điện thoại *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nhập số điện thoại" />
            </div>
          </div>
          <div className="field full">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Nhập email (tùy chọn)" />
          </div>
        </div>

        <div className="card">
          <h2>Phương thức nhận hàng</h2>
          <div className="option" onClick={() => setDeliveryMethod('delivery')}>
            <input type="radio" checked={deliveryMethod==='delivery'} readOnly />
            <div className="info">
              <div className="title">Giao hàng tận nơi</div>
              <div className="desc">Phí giao hàng: 15,000₫</div>
            </div>
          </div>
          <div className="option" onClick={() => setDeliveryMethod('pickup')}>
            <input type="radio" checked={deliveryMethod==='pickup'} readOnly />
            <div className="info">
              <div className="title">Nhận tại cửa hàng</div>
              <div className="desc">Miễn phí – Sẵn sàng sau 15 phút</div>
            </div>
          </div>
          {deliveryMethod==='delivery' && (
            <div className="field full">
              <label>Địa chỉ giao hàng *</label>
              <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Nhập địa chỉ chi tiết"/>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Phương thức thanh toán</h2>
          <div className="option" onClick={()=>setPaymentMethod('cash')}>
            <input type="radio" checked={paymentMethod==='cash'} readOnly />
            <div className="info">
              <div className="title">Tiền mặt</div>
              <div className="desc">Thanh toán khi nhận hàng</div>
            </div>
          </div>
          <div className="option" onClick={()=>setPaymentMethod('transfer')}>
            <input type="radio" checked={paymentMethod==='transfer'} readOnly />
            <div className="info">
              <div className="title">Chuyển khoản</div>
              <div className="desc">Chuyển khoản qua ngân hàng</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Ghi chú đơn hàng</h2>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)" />
        </div>
      </div>

      {/* ==== CỘT PHẢI ==== */}
      <aside className="right-col">
        <div className="card summary-order">
          <h2>Đơn hàng của bạn</h2>
          {items.map(i=>(
            <div key={i.id} className="item">
              <img src={i.image} alt={i.name}/>
              <div className="info">
                {i.name} ({i.size}{i.mood?`, ${i.mood}`:''}) x{i.quantity}
              </div>
              <div className="price">{(i.price*i.quantity).toLocaleString('vi-VN')}₫</div>
            </div>
          ))}
        </div>

        <div className="card coupon">
          <h2>Mã giảm giá</h2>
          <div className="apply">
            <input value={couponCode} onChange={e=>setCouponCode(e.target.value)} placeholder="Nhập mã giảm giá"/>
            <button onClick={handleApplyCoupon}>Áp dụng</button>
          </div>
          <div className="available">
            <div className="label">Mã giảm giá có sẵn:</div>
            {availableCoupons.map(c=>(
              <div key={c.code} className="code" onClick={()=>setCouponCode(c.code)}>
                <div>
                  <div className="code-name">{c.code}</div>
                  <div className="code-desc">{c.description}</div>
                </div>
                <div className="code-discount">-{c.discount.toLocaleString('vi-VN')}₫</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card total">
          <h2>Tổng cộng</h2>
          <div className="line"><span>Tạm tính</span><span>{subtotal.toLocaleString('vi-VN')}₫</span></div>
          <div className="line"><span>Phí giao hàng</span><span>{deliveryFee.toLocaleString('vi-VN')}₫</span></div>
          {discount>0 && <div className="line discount"><span>Giảm giá</span><span>-{discount.toLocaleString('vi-VN')}₫</span></div>}
          <div className="line total-line"><strong>Tổng cộng</strong><strong>{total.toLocaleString('vi-VN')}₫</strong></div>
          <button className="place-order" onClick={handlePlaceOrder}>Đặt hàng</button>
          <div className="note-small">Bằng cách đặt hàng, bạn đồng ý với <a href="/terms">Điều khoản dịch vụ</a></div>
        </div>
      </aside>
    </div>
    </>
  );
};


