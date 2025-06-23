import { AdminApiRequest } from '@/services/AdminApiRequest';
import { Button, Form, message, Table, Tag, Popconfirm, Input, Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../../admin/adminPage.scss';
import SearchInput from '@/components/Search/SearchInput';
import StatusDropdown from '@/components/littleComponent/StatusDropdown/StatusDropdown';
import AdminButton from '@/pages/admin/button/AdminButton';

export const OrderList = () => {
  const [managerOrderList, setManagerOrderList] = useState<any[]>([]);
  const [originalManagerOrderList, setOriginalManagerOrderList] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [staffInput, setStaffInput] = useState<{ [orderId: number]: string }>({}); // lưu staff tạm

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

  // Hàm cập nhật trạng thái và lưu staffName
  const handleChangeStatus = async (id: number, newStatus: string) => {
    const staffName = staffInput[id] || managerOrderList.find(o => o.id === id)?.staffName || "";
    if (!staffName) {
      message.warning("Vui lòng nhập tên nhân viên trước khi đổi trạng thái!");
      return;
    }
    try {
      await AdminApiRequest.put(`/branch-order/status/${id}`, {
        status: newStatus,
        staffName: staffName
      });
      message.success('Cập nhật trạng thái và nhân viên thành công.');
      fetchManagerOrderList();
      setStaffInput(prev => ({ ...prev, [id]: "" })); // clear input nếu cần
    } catch (error) {
      message.error('Không thể cập nhật trạng thái.');
    }
  };

  // Hàm hủy (truyền cả staffName nếu cần)
  const handleCancelOrder = async (id: number) => {
    const staffName = staffInput[id] || managerOrderList.find(o => o.id === id)?.staffName || "";
    if (!staffName) {
      message.warning("Vui lòng nhập tên nhân viên trước khi hủy!");
      return;
    }
    try {
      await AdminApiRequest.put(`/branch-order/status/${id}`, {
        status: "CANCELLED",
        staffName
      });
      message.success('Đơn hàng đã được hủy.');
      fetchManagerOrderList();
      setStaffInput(prev => ({ ...prev, [id]: "" }));
    } catch (error) {
      message.error('Không thể hủy đơn hàng.');
    }
  };

  // Cấu hình trạng thái
  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'PREPARING', label: 'Đang chuẩn bị' },
    { value: 'READY', label: 'Sẵn sàng' },
    { value: 'DELIVERING', label: 'Đang giao' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  // Map trạng thái sang label và màu sắc
  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Chờ xác nhận', color: 'orange' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'blue' },
    PREPARING: { label: 'Đang chuẩn bị', color: 'purple' },
    READY: { label: 'Sẵn sàng', color: 'cyan' },
    DELIVERING: { label: 'Đang giao', color: 'geekblue' },
    COMPLETED: { label: 'Hoàn thành', color: 'green' },
    CANCELLED: { label: 'Đã hủy', color: 'red' },
  };

  return (
    <div className="container-fluid m-2">
      <div className='sticky-header-wrapper'>
        <h2 className="h2 header-custom">DANH SÁCH ĐƠN HÀNG</h2>
        <div className="header-actions d-flex me-3 py-2 align-items-center justify-content-between">
          <div className="flex-grow-1 d-flex justify-content-center">
            <Form layout="inline" className="search-form d-flex">
              <SearchInput
                placeholder="Tìm kiếm theo SĐT, mã đơn hoặc nhân viên"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onSearch={handleSearchKeyword}
                allowClear
              />
            </Form>
          </div>
          <div className="d-flex" >
            <AdminButton
              variant="primary"
              size='sm' 
              icon={<DownloadOutlined />}
              onClick={handleExportManagerOrderList}
              title='Tải xuống danh sách'
            />
          </div>
        </div>
      </div>

      <Table
        className='custom-table'
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
            dataIndex: 'staffName',
            key: 'staffName',
            render: (staffName: string, record: any) => (
              <Input
                value={staffInput[record.id] ?? staffName ?? ""}
                placeholder="Tên nhân viên"
                size="small"
                style={{ width: 120 }}
                onChange={e =>
                  setStaffInput(prev => ({
                    ...prev,
                    [record.id]: e.target.value
                  }))
                }
              />
            ),
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
              <StatusDropdown 
                value={record.status}
                onChange={(newStatus) => handleChangeStatus(record.id, newStatus)}
                statusMap={statusMap}
              >
              </StatusDropdown>
            )
          }
        ]}
      />
    </div>
  );
};

export default OrderList;
