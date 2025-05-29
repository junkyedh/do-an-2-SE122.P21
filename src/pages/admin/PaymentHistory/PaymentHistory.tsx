import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Modal, Form, Input, InputNumber, DatePicker, Select, Tag, message } from 'antd';
import { MainApiRequest } from '@/services/MainApiRequest';

const { RangePicker } = DatePicker;

const PaymentHistory = () => {
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [openCreatePaymentModal, setOpenCreatePaymentModal] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<any | null>(null);

  const fetchPaymentsList = async () => {
    const res = await MainApiRequest.get('/payment/list');
    setPaymentsList(res.data);
  };

  useEffect(() => {
    fetchPaymentsList();
  }, []);

  const onOpenCreatePaymentModal = () => {
    form.resetFields();
    setCurrentPayment(null);
    setIsEditing(false);
    setOpenCreatePaymentModal(true);
  };

  const onOKCreatePayment = () => {
    form.validateFields().then(values => {
      const newPayment = {
        ...values,
        id: isEditing ? currentPayment.id : paymentsList.length + 1,
        paymentDate: new Date().toISOString().split('T')[0],
      };

      if (isEditing) {
        setPaymentsList(
          paymentsList.map(payment =>
            payment.id === currentPayment.id ? newPayment : payment
          )
        );
      } else {
        setPaymentsList([...paymentsList, newPayment]);
      }

      setOpenCreatePaymentModal(false);
    });
  };

  const onCancelCreatePayment = () => {
    setOpenCreatePaymentModal(false);
  };

  const onConfirmPayment = async (record: any) => {
    // setCurrentPayment(record);
    // form.setFieldsValue(record);
    // setIsEditing(true);
    // setOpenCreatePaymentModal(true);
    const id = record.id;
    const res = await MainApiRequest.post(`/payment/confirm/${id}`);
    if (res.status === 200) {
      message.success('Payment confirmed successfully!');
      fetchPaymentsList();
    }
  };

  const onDeletePayment = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this payment?',
      onOk: () => {
        setPaymentsList(paymentsList.filter(payment => payment.id !== id));
      },
    });
  };

  return (
    <div className="container-fluid m-2">
      <h3 className="h3">Payment History</h3>
      {/* <Button type="primary" onClick={onOpenCreatePaymentModal}>
        Create Payment
      </Button> */}

      <Modal
        title={isEditing ? 'Edit Payment' : 'Create Payment'}
        open={openCreatePaymentModal}
        onOk={onOKCreatePayment}
        onCancel={onCancelCreatePayment}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[{ required: true, message: 'Please input customer name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Please input amount!' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Payment Date"
            name="paymentDate"
            rules={[{ required: true, message: 'Please select payment date!' }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select payment status!' }]}>
            <Select>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={paymentsList}
        columns={[
          { title: 'Booking Reservation Code', dataIndex: 'booking', key: 'bookingCode', render: (booking: any) => booking.reservationCode },
          { title: 'Customer Name', dataIndex: 'booking', key: 'customerName', render: (booking: any) => booking.customerName },
          { title: 'Payment Remark', dataIndex: 'description', key: 'description' },
          { title: 'Amount', dataIndex: 'amount', key: 'amount' },
          { title: 'Payment Date', dataIndex: 'paymentDate', key: 'paymentDate' },
          { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'CONFIRMED' ? 'green' : 'red'}>{status}</Tag> },
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                {
                  record.status === 'PENDING' && (
                    <Button onClick={() => onConfirmPayment(record)}>Confirm</Button>
                  )
                }
                {/* <Button onClick={() => onDeletePayment(record.id)} danger>
                  Delete
                </Button> */}
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PaymentHistory;
