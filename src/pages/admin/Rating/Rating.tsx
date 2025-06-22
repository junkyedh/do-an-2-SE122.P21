import React, { useEffect, useState } from 'react';
import { Table, Rate, Space, Image, Select, message } from 'antd';
import { MainApiRequest } from '@/services/MainApiRequest';
import moment from 'moment';
import { AdminApiRequest } from '@/services/AdminApiRequest';

const AdminCustomerRating = () => {
    const [ratingsList, setRatingsList] = useState<any[]>([]);
    const [allRatings, setAllRatings] = useState<any[]>([]);
    const [productList, setProductList] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const fetchRatingsList = async () => {
        try {
            const res = await AdminApiRequest.get('/ratings/list');
            setRatingsList(res.data);
            setAllRatings(res.data);
        } catch (error) {
            console.error('Failed to fetch ratings', error);
            message.error('Không thể tải đánh giá');
        }
    };

    const fetchProductList = async () => {
        try {
            const res = await AdminApiRequest.get('/product/list');
            setProductList(res.data);
        } catch (error) {
            console.error('Failed to fetch product list', error);
            message.error('Không thể tải danh sách sản phẩm');
        }
    };

    useEffect(() => {
        fetchRatingsList();
        fetchProductList();
    }, []);

    const handleProductFilterChange = (value: number | undefined) => {
        setSelectedProductId(value ?? null); // Cập nhật giá trị đã chọn

        if (!value) {
            setRatingsList(allRatings); // Nếu không chọn gì thì hiển thị tất cả
        } else {
            setRatingsList(
                allRatings.filter((r) => r.product && Number(r.product.id) === Number(value))
            );
        }
    };

    return (
        <div className="container-fluid m-2">
            <h3 className='h3 mb-3'>Quản lý đánh giá khách hàng</h3>

            <div className='mb-3' style={{ maxWidth: 300 }}>
                <Select
                    allowClear
                    placeholder="Lọc theo sản phẩm"
                    style={{ width: '100%' }}
                    onChange={handleProductFilterChange}
                    value={selectedProductId ?? undefined}
                    options={productList.map(p => ({
                        label: p.name,
                        value: Number(p.id), // Đảm bảo kiểu số
                    }))}
                />
            </div>

            <Table
                rowKey="id"
                dataSource={ratingsList}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                columns={[
                    {
                        title: 'Tên khách hàng',
                        dataIndex: ['customer', 'name'],
                        key: 'customerName',
                    },
                    {
                        title: 'SĐT',
                        dataIndex: ['customer', 'phone'],
                        key: 'customerPhone',
                    },
                    {
                        title: 'Hạng',
                        dataIndex: ['customer', 'rank'],
                        key: 'customerRank',
                        render: (rank: string) => rank || 'Thường'
                    },
                    {
                        title: 'Sản phẩm',
                        dataIndex: ['product', 'name'],
                        key: 'productName',
                    },
                    {
                        title: 'Hình ảnh',
                        dataIndex: ['product', 'image'],
                        key: 'productImage',
                        render: (url: string) => <Image src={url} alt="product" width={50} height={50} />
                    },
                    {
                        title: 'Sao',
                        dataIndex: 'star',
                        key: 'star',
                        render: (star: number) => <Rate disabled defaultValue={star} />
                    },
                    {
                        title: 'Nội dung',
                        dataIndex: 'description',
                        key: 'description',
                    },
                    {
                        title: 'Ngày đánh giá',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (value: string) => moment(value).format('DD-MM-YYYY HH:mm:ss')
                    },
                ]}
            />
        </div>
    );
};

export default AdminCustomerRating;
