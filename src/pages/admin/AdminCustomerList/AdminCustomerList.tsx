import { Button, Form, Input, message, Table, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import "./AdminCustomerList.scss";
import SearchInput from '@/components/Search/SearchInput';
import { AdminApiRequest } from '@/services/AdminApiRequest';

const AdminCustomerList = () => {
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    const fetchCustomerList = async () => {
        try {
            const res = await AdminApiRequest.get('/customer/list');
            setCustomerList(res.data);
        } catch (error) {
            console.error('Error fetching customer list:', error);
            message.error('Failed to fetch customer list.');
        }
    };

    useEffect(() => {
        fetchCustomerList();
    }, []);


    const handleSearchKeyword = () => {
        if (!searchKeyword.trim()) {
            fetchCustomerList(); // Lấy lại danh sách đầy đủ nếu không có từ khóa tìm kiếm
            return;
        }
        const keyword = searchKeyword.toLowerCase();
        const filtered = customerList.filter(customer =>
            customer.name.toLowerCase().includes(keyword) ||
            customer.id.toLowerCase().includes(keyword) ||
            customer.phone.toLowerCase().includes(keyword)
        );
        setCustomerList(filtered);
    }

    const handleImportExcel = (file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            console.log("Imported Excel data:", jsonData);
            message.success("Import thành công (chỉ hiển thị, không lưu vào hệ thống).");
            // Có thể thêm logic hiển thị hoặc xử lý khác nếu cần
        };
        reader.readAsArrayBuffer(file);
        return false; // Ngăn AntD upload mặc định
    };

    const exportExcel = () => {
        const exportData = customerList.map((customer) => ({
            'ID': customer.id,
            'Tên khách hàng': customer.name,
            'Giới tính': customer.gender,
            'Số điện thoại': customer.phone,
            'Tổng tiền': customer.total,
            'Ngày đăng ký': moment(customer.registrationDate).format('DD-MM-YYYY HH:mm:ss'),
            "Hạng thành viên": customer.rank,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachNhanVien");
        XLSX.writeFile(workbook, "DanhSachNhanVien.xlsx");
    };

    return (
        <div className="container-fluid m-2">
            <h2 className="h2 header-custom">DANH SÁCH KHÁCH HÀNG</h2>
            {/* Tìm kiếm và Import + Export */}
            <div className="d-flex me-2 py-2 align-items-center justify-content-between">
                <div className="flex-grow-1 d-flex justify-content-center">
                    <Form layout="inline" className="search-form d-flex">
                    <SearchInput
                        placeholder="Tìm kiếm theo tên, loại nhân viên hoặc SĐT"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onSearch={handleSearchKeyword}
                        allowClear
                    />
                    </Form>
                </div>
                <div className="d-flex" >
                    <Upload
                    beforeUpload={handleImportExcel}
                    showUploadList={false}
                    accept=".xlsx, .xls"
                    >
                    <Button 
                        type="default" icon={<UploadOutlined />}
                        title='Tải lên file Excel'
                    />
                    </Upload>
                    <Button 
                    type="default" icon={<DownloadOutlined />}
                    onClick={exportExcel}
                    title='Tải xuống danh sách'
                    />
                </div>
            </div>

            <Table
                dataSource={customerList}
                rowKey="id"
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên khách hàng', dataIndex: 'name', key: 'name' },
                    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
                    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    {
                        title: 'Tổng tiền',
                        dataIndex: 'total',
                        key: 'total',
                        render: (value: number) =>
                            new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(value),
                    },
                    { title: 'Hạng thành viên', dataIndex: 'rank', key: 'rank' },
                    {
                        title: 'Ngày đăng ký',
                        dataIndex: 'registrationDate',
                        key: 'registrationDate',
                        render: (value: string) =>
                            value ? moment(value).format('DD-MM-YYYY HH:mm:ss') : '-',
                    },
                ]}
            />
        </div>
    );
};

export default AdminCustomerList;
