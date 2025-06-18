import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, Rate, message } from 'antd';
import './HistoryOrder.scss';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { MainApiRequest } from '@/services/MainApiRequest';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Truck } from 'lucide-react';

interface OrderSummary {
  id: number;
  phoneCustomer: string;
  serviceType: 'TAKE AWAY' | 'DINE IN';
  totalPrice: number;
  orderDate: string;
  status: string;
}

interface OrderDetail {
  productId: number;
  name: string;
  image: string;
  size: string;
  mood?: string;
  quantity: number;
  price: number;
}

const statusMap: Record<
  string,
  { label: string; color: string; icon: React.ComponentType }
> = {
  PENDING:    { label: 'Chờ xác nhận',    color: 'orange',    icon: Clock },
  CONFIRMED:  { label: 'Đã xác nhận',      color: 'blue',      icon: CheckCircle },
  PREPARING:  { label: 'Đang chuẩn bị',     color: 'orange',    icon: Clock },
  READY:      { label: 'Sẵn sàng',          color: 'green',     icon: CheckCircle },
  DELIVERING: { label: 'Đang giao',        color: 'purple',    icon: Truck },
  COMPLETED:  { label: 'Hoàn thành',        color: 'green',     icon: CheckCircle },
  CANCELLED:  { label: 'Đã hủy',            color: 'red',       icon: Clock },
};

const HistoryOrder: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [details, setDetails] = useState<Record<number, OrderDetail[]>>({});
  const [loading, setLoading] = useState(false);

  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [currentProd, setCurrentProd] = useState<OrderDetail|null>(null);
  const [star, setStar] = useState(5);
  const [comment, setComment] = useState('');
  const [phone, setPhone] = useState<string>('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 1) Load phoneCustomer
  useEffect(() => {
    MainApiRequest.get<{ phoneCustomer: string }>('/auth/callback')
      .then(r => {
        setPhone(r.data.phoneCustomer);
        // 2) Lấy đơn hàng của khách
        return MainApiRequest.get<OrderSummary[]>(`/order/customer/${encodeURIComponent(r.data.phoneCustomer)}`);
      })
      .then(r => setOrders(r.data))
      .catch(err => {
        console.error(err);
        message.error('Không tải được lịch sử đơn hàng');
      });
  }, []);

  // Lấy chi tiết order nếu cần
  const fetchDetails = async (orderId: number) => {
    if (details[orderId]) return;
    try {
      const res = await MainApiRequest.get<OrderDetail[]>(`/order/detail/${orderId}`);
      setDetails(d => ({ ...d, [orderId]: res.data }));
    } catch (err) {
      console.error(err);
      message.error('Không tải được chi tiết đơn');
    }
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: OrderSummary, b: OrderSummary) => a.id - b.id
    },
    {
      title: 'Ngày',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (d: string) => new Date(d).toLocaleString('vi-VN')
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (p: number) => p.toLocaleString('vi-VN') + '₫',
      sorter: (a: OrderSummary, b: OrderSummary) => a.totalPrice - b.totalPrice
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const info = statusMap[st] || { label: st, color: 'gray', icon: Clock };
        return <Tag color={info.color}>{info.label}</Tag>;
      }
    }
  ];

  // Mở modal đánh giá
  const openRating = (prod: OrderDetail) => {
    setCurrentProd(prod);
    setStar(5);
    setComment('');
    form.resetFields();
    setRatingModalVisible(true);
  };

  // Gửi đánh giá
  const submitRating = async () => {
    if (!currentProd) return;
    try {
      await MainApiRequest.post('/ratings', {
        phoneCustomer: phone,
        productId: currentProd.productId,
        description: comment,
        star
      });
      message.success('Cảm ơn đánh giá của bạn!');
      setRatingModalVisible(false);
    } catch (err) {
      console.error(err);
      message.error('Gửi đánh giá thất bại');
    }
  };

  return (
    <>
      <Breadcrumbs
        title="Lịch sử đơn hàng"
        items={[{ label:'Trang chủ',to:'/' },{ label:'Lịch sử đơn' }]}
      />

      <section className="history-order">
        <Table<OrderSummary>
          dataSource={orders}
          rowKey="id"
          columns={columns}
          expandable={{
            expandedRowRender: order => (
              <div className="order-details">
                {(details[order.id] || []).map(prod => (
                  <div key={prod.productId} className="detail-item">
                    <img src={prod.image} alt={prod.name} />
                    <div className="info">
                      <div className="name">{prod.name}</div>
                      <div>Size: {prod.size}{prod.mood?`, ${prod.mood==='hot'?'Nóng':'Lạnh'}`:''}</div>
                      <div>Số lượng: {prod.quantity}</div>
                      <div>Giá: {(prod.price*prod.quantity).toLocaleString('vi-VN')}₫</div>
                    </div>
                    {order.status==='COMPLETED' && (
                      <Button type="primary" onClick={()=>openRating(prod)}>
                        Đánh giá
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ),
            onExpand: (expanded, record) => expanded && fetchDetails(record.id)
          }}
        />
      </section>

      <Modal
        title={`Đánh giá "${currentProd?.name}"`}
        visible={ratingModalVisible}
        onOk={submitRating}
        onCancel={()=>setRatingModalVisible(false)}
        okText="Gửi"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Số sao">
            <Rate value={star} onChange={setStar} />
          </Form.Item>
          <Form.Item label="Bình luận">
            <Input.TextArea
              rows={3}
              value={comment}
              onChange={e=>setComment(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default HistoryOrder;
