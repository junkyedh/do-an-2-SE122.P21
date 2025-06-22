import React, { useState, useEffect, use } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.scss';
import { MainApiRequest } from '@/services/MainApiRequest';
import Breadcrumbs from '@/components/littleComponent/Breadcrumbs/Breadcrumbs';
import { message } from 'antd';
import { CartItem, useCart } from '@/hooks/cartContext';

interface LocationStateItem {
  productId: number;
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

interface OrderItem {
    productId: number;
    name: string;
    image: string;
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

interface  Brach {
    id: number;
    name: string;
    address: string;
    phone: string;
}

interface Membership {
    id: number;
    rank: string;
    mPrice: number;
    discount: number;
}

export const Checkout: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const {cart, fetchCart, removeCartItemsAfterOrder} = useCart();

    // Order items
    const [items, setItems] = useState<(OrderItem | CartItem)[]>([]);
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
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
    // Branches
    const [branches, setBranches] = useState<Brach[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    // Membership
    const [membershipList, setMembershipList] = useState<Membership[]>([]);
    const [membershipDiscount, setMembershipDiscount] = useState(0);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
    MainApiRequest.get('/auth/callback')
        .then(() => setIsLoggedIn(true))
        .catch(() => setIsLoggedIn(false));
    }, []);
  
    useEffect(() => {
        MainApiRequest.get<Coupon[]>('/promote/coupon/list')
        .then(res => setAvailableCoupons(res.data))
        .catch(err => console.error('Failed to fetch coupons:', err));
    }, []);
    
    useEffect(() => {
        MainApiRequest.get<Membership[]>('/membership/list')
        .then(res =>  setMembershipList(res.data))
        .catch(err => console.error('Failed to fetch membership:', err));
    }, []);

    // Nếu đến từ "Mua ngay" thì lấy items từ state (state.initialItems); nếu không thì fetch từ giỏ hàng
    useEffect(() => {
        (async () => {
            if (state?.initialItems) {
            const mapped = await Promise.all(
                (state.initialItems as LocationStateItem[]).map(async (it) => {
                    const {data: res} = await MainApiRequest.get<ProductDetail>(`/product/${it.productId}`);
                    const sz = res.sizes.find((s) => s.sizeName === it.size || { sizeName: it.size, price: 0 });
                    return {
                        productId: Number(res.id),
                        name: res.name,
                        image: res.image,
                        size: it.size,
                        mood: it.mood,
                        quantity: it.quantity,
                        price: sz?.price || 0, // nếu không tìm thấy size thì giá là 0
                    } as OrderItem;
                })
            );
            setItems(mapped);
            } else {
                //fallback: lấy từ giỏ hàng
                await fetchCart()
                setItems(
                    cart.map((it) => ({
                        productId: Number(it.productId),
                        name: it.name,
                        image: it.image,
                        size: it.size,
                        mood: it.mood,
                        quantity: it.quantity,
                        price: it.price,
                    }))
                );
            }
        })()
    }, [state, cart])

    // Try to auto-fill phone (logged-in)
    useEffect(() => {
        try {
            // Lấy thông tin người dùng từ API
            MainApiRequest.get<{
                data: {
                    phone?: string;
                    name?: string;
                    email?: string;
                    address?: string;
                }
            }>('/auth/callback')
            .then ((res) => {
                const profile = res.data.data;
                if (profile.phone) setPhone(profile.phone);
                if (profile.name) setName(profile.name);
                if (profile.email) setEmail(profile.email);
                if (profile.address) setAddress(profile.address);
            }) 
            .catch ((err) => {
                console.error('Failed to fetch user profile:', err);
            });
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    }, []);

    //Khi items đã load, fetch available-branches cho từng sản phẩm rồi lấy intersection
    useEffect(() => {
        if (!items.length) return;
        (async () => {
            const lists = await Promise.all(
                items.map(it =>
                    MainApiRequest.get<Brach[]>(`/product/available-branches/${it.productId}`)
                    .then (res => res.data)
                    .catch (() => [])
                )
            );
            // intersect theo id
            const common = lists.reduce((prev, curr) => 
                prev.filter(b => curr.some(c => c.id === b.id))
            );
            setBranches(common);
            if (common.length && selectedBranch === null) setSelectedBranch(common[0].id);
        })();
    }, [items]);

    // Tính membership discount dựa vào rank customer (auth callback trả về data.rank)
    useEffect(() => {
        (async () => {
            try {
                const res = await MainApiRequest.get<{ msg: string; data: { rank: string } }>('/auth/callback');
                const rank = res.data.data.rank;
                const tier = membershipList.find(m => m.rank === rank);
                if (tier) {
                    setMembershipDiscount(tier.discount);
                    console.log(`Membership discount for ${rank}: ${tier.discount.toLocaleString('vi-VN')}₫`);
                }} catch (err) {
                    console.error('Failed to fetch membership rank:', err);
                }
            })();
        }, [membershipList]);

    const deliveryFee = deliveryMethod === 'delivery' ? 10000 : 0;
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    //nếu đã dùng voucher thì không tính membership discount
    const membershipApplied = appliedCoupon ? 0 : membershipDiscount;
    const totalBeforeMembership = subtotal + deliveryFee - discount;
    const finalTotal = totalBeforeMembership - membershipApplied;

    const handleApplyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        const c = availableCoupons.find((x) => x.code.toUpperCase() === code);
        if (c) {
            setAppliedCoupon(c);
            message.success(`Áp dụng mã giảm giá thành công: ${c.code} - Giảm ${c.discount.toLocaleString('vi-VN')}₫`);
        } else alert('Mã giảm giá không hợp lệ!');
    };

    const handlePlaceOrder = async () => {
        if (!name.trim() || !phone.trim()) {
            message.error('Vui lòng nhập đầy đủ họ tên và số điện thoại.');
            return;
        }
        if (!selectedBranch) {
            message.error('Vui lòng chọn chi nhánh.');
            return;
        }
        if (deliveryMethod === 'delivery' && !address.trim()) {
            message.error('Vui lòng nhập địa chỉ giao hàng.');
            return;
        }
        try {
            const {data: o} = await MainApiRequest.post<{ id: number }>('/order', {
                phoneCustomer: phone,
                name,
                address,
                serviceType: deliveryMethod === 'delivery' ? 'TAKE AWAY' : 'DINE IN',
                orderDate: new Date().toISOString(),
                status: 'PENDING',
                productIDs: items.map((it) => Number((it as any).productId)),
                branchId: selectedBranch!,
            });
            const orderId = o.id;

            // 2) Tạo order details
            await Promise.all(
                items.map((it) => {
                    //Trực tiếp return Promise từ MainApiRequest.post
                    return MainApiRequest.post(`/order/detail/${orderId}`, {
                        orderID: orderId,
                        productID: Number(it.productId),
                        size: it.size,
                        mood: it.mood,
                        quantity: it.quantity,
                    })
                })
            ).catch((err) => {
                console.log('Order details created successfully:', orderId);
                console.error('Failed to create order details:', err);
                throw new Error('Không thể tạo chi tiết đơn hàng, vui lòng thử lại.');
            });

            // 3) Xoá khỏi giỏ hàng sản phẩm vừa đặt va chuyển sang trang theo dõi đơn hàng
            await removeCartItemsAfterOrder(items);
            message.success('Đặt hàng thành công!');

            // LƯU PHONE GUEST
            // const isLoggedIn = await MainApiRequest.get('/auth/callback').then(()=>true).catch(()=>false);
            if (!isLoggedIn) {
                // Lưu lại cả orderId và phone cho tracking, tránh trùng đơn
                const guestHistory = JSON.parse(localStorage.getItem('guest_order_history') || '[]');
                const newHistory = [{ orderId, phone }, ...guestHistory].slice(0, 10); // Giới hạn 10 đơn gần nhất
                localStorage.setItem('guest_order_history', JSON.stringify(newHistory));
            }
            navigate(`/tracking-order/${orderId}`, { replace: true });
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
                <div className="desc">Phí giao hàng: 10,000₫</div>
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
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Nhập địa chỉ giao hàng" />
                </div>
            )}  
            <div className="field full">
                <label>Chọn chi nhánh</label>
                <select 
                    value={selectedBranch ?? ''}
                    onChange={e => setSelectedBranch(parseInt(e.target.value, 10))}
                >
                    <option value="" disabled>-- Chọn chi nhánh --</option>
                    {branches.map(b => (
                        <option key={b.id} value={b.id}>
                            {b.name} - {b.address}
                        </option>
                    ))}
                </select>
            </div>
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
                <div key={i.productId} className="item">
                <img src={i.image} alt={i.name}/>
                <div className="info">
                    {i.name} ({i.size}{i.mood?`, ${i.mood}`:''}) x{i.quantity}
                </div>
                <div className="price">{(i.price*i.quantity).toLocaleString('vi-VN')}₫</div>
                </div>
            ))}
        </div>

        <div className="card coupon">
            <input 
                value={couponCode} 
                onChange={e=> setCouponCode(e.target.value)} 
                placeholder="Nhập mã giảm giá"/>
            <button onClick={handleApplyCoupon}>Áp dụng</button>
        </div>

        <div className="card total">
            <h2>Tổng cộng</h2>
            <div className="line"><span>Tạm tính</span><span>{subtotal.toLocaleString('vi-VN')}₫</span></div>
            <div className="line"><span>Phí giao hàng</span><span>{deliveryFee.toLocaleString('vi-VN')}₫</span></div>
            {discount > 0 && (
                <div className="line discount">
                    <span>Giảm giá voucher</span>-<span>{discount.toLocaleString('vi-VN')}₫</span>
                </div>
            )}
            {membershipApplied > 0 && (
                <div className="line discount">
                    <span>Giảm giá thành viên</span>-<span>{membershipApplied.toLocaleString('vi-VN')}₫</span>
                </div>
            )}
            <div className="line total-line">
                <strong>Tổng cộng</strong><strong>{finalTotal.toLocaleString('vi-VN')}₫</strong>
            </div>
          
          <button className="place-order" onClick={handlePlaceOrder}>Đặt hàng</button>
          <div className="note-small">Bằng cách đặt hàng, bạn đồng ý với <a href="/terms">Điều khoản dịch vụ</a></div>
        </div>
      </aside>
    </div>
    </>
  );
};


