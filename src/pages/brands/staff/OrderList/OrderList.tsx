import { AdminApiRequest } from '@/services/AdminApiRequest';
import { Button, Form, message, Table, Tag, Popconfirm, Dropdown, Menu } from 'antd';
import { DownloadOutlined, MoreOutlined } from '@ant-design/icons';
import { Clock, CheckCircle, Truck, MapPin, Phone, Mail, ArrowLeft, Package, CreditCard } from "lucide-react"
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './OrderList.scss';
import SearchInput from '@/components/Search/SearchInput';

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

export const OrderList = () => {
  const [managerOrderList, setManagerOrderList] = useState<any[]>([]);
  const [originalManagerOrderList, setOriginalManagerOrderList] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchManagerOrderList = async () => {
    const res = await AdminApiRequest.get('/branch-order/list');
    setManagerOrderList(res.data);
    setOriginalManagerOrderList(res.data);
  };

  useEffect(() => {
    fetchManagerOrderList();
  }, []);

  const handleSearchKeyword = () => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      fetchManagerOrderList();
      return;
    }
    const filtered = originalManagerOrderList.filter(order => {
      const id = String(order.id ?? '').toLowerCase();
      const phoneCustomer = (order.phoneCustomer ?? '').toLowerCase();
      const staffName = (order.staffName ?? '').toLowerCase();

      return id.includes(keyword) || phoneCustomer.includes(keyword) || staffName.includes(keyword);
    });
    setManagerOrderList(filtered);
  };

  // Reset search when keyword is empty
  useEffect(() => {
    if (!searchKeyword.trim()) {
      fetchManagerOrderList();
    }
  }, [searchKeyword]);

  const handleExportManagerOrderList = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      managerOrderList.map(order => ({
        'Mã đơn': order.id,
        'Số điện thoại': order.phoneCustomer,
        'Loại phục vụ': order.serviceType,
        'Tổng tiền': order.totalPrice,
        'Ngày đặt': moment(order.orderDate).format('DD-MM-YYYY HH:mm:ss'),
        'Nhân viên': order.staffName,
        'Trạng thái': order.status
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh Sách Đơn Hàng');
    XLSX.writeFile(workbook, 'DanhSachDonHang.xlsx');
    message.success('Xuất danh sách đơn hàng thành công.');
  };

  const handleCompleteOrder = async (id: number) => {
    try {
      await AdminApiRequest.put(`/branch-order/complete/${id}`);
      message.success('Đơn hàng đã được cập nhật thành hoàn thành.');
      fetchManagerOrderList();
    } catch (error) {
      console.error('Error completing order:', error);
      message.error('Không thể cập nhật trạng thái hoàn thành.');
    }
  };

  const handleChangeStatus = async (id: number, newStatus: string) => {
    try {
      await AdminApiRequest.put(`/branch-order/status/${id}`, { status: newStatus });
      message.success(`Đã cập nhật trạng thái đơn hàng thành ${statusMap[newStatus]?.label || newStatus}`);
      fetchManagerOrderList();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleCancelOrder = async (id: number) => {
    try {
      await AdminApiRequest.put(`/branch-order/cancel/${id}`);
      message.success('Đơn hàng đã được hủy.');
      fetchManagerOrderList();
    } catch (error) {
      console.error('Error canceling order:', error);
      message.error('Không thể hủy đơn hàng.');
    }
  };
  const statusMenu = (id: number) => (
    <Menu
      onClick={({ key }) => handleChangeStatus(id, key)}
      items={Object.entries(statusMap).map(([status, config]) => ({
        key: status,
        label: config.label,
      }))}
    />
  );


  return (
    <div className="container-fluid m-2">
      <div className='sticky-header-wrapper'>
        <h2 className="h2 header-custom">DANH SÁCH ĐƠN HÀNG</h2>
        {/* Tìm kiếm và  Export */}
        <div className="header-actions d-flex me-3 py-2 align-items-center justify-content-between">
          <div className="flex-grow-1 d-flex justify-content-center">
            <Form layout="inline" className="search-form d-flex">
              <SearchInput
              placeholder="Tìm kiếm theo SĐT, mã đơn hoặc nhân viên"
              value={searchKeyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
              onSearch={handleSearchKeyword}
              allowClear
              />
            </Form>
          </div>
          <div className="d-flex" >
            <Button
              type="default" icon={<DownloadOutlined />}
              onClick={handleExportManagerOrderList}
              title='Tải xuống danh sách'
            />
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <Table
        dataSource={managerOrderList}
        rowKey="id"
        columns={[
          {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id
          },
          {
            title: 'Số điện thoại',
            dataIndex: 'phoneCustomer',
            key: 'phoneCustomer'
          },
          {
            title: 'Loại phục vụ',
            dataIndex: 'serviceType',
            key: 'serviceType',
            sorter: (a, b) => a.serviceType.localeCompare(b.serviceType)
          },
          {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice
          },
          {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date: string) => moment(date).format('DD-MM-YYYY HH:mm:ss'),
            sorter: (a, b) => moment(a.orderDate).unix() - moment(b.orderDate).unix()
          },
          {
            title: 'Nhân viên',
            dataIndex: ['staff', 'name'],
            key: 'staffName',
            sorter: (a, b) => a.staffName.localeCompare(b.staffName)
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
              const map = statusMap[status];
              return map ? <Tag color={map.color}>{map.label}</Tag> : <Tag>{status}</Tag>;
            },
            sorter: (a, b) => {
              const labelA = statusMap[a.status]?.label || a.status;
              const labelB = statusMap[b.status]?.label || b.status;
              return labelA.localeCompare(labelB);
            }
          },
          {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
              <Dropdown overlay={statusMenu(record.id)} trigger={['click']}>
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            )
          }
        ]}
      />
    </div>
  );
};

export default OrderList;
