import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { MainApiRequest } from "@/services/MainApiRequest";
import "./ProfileUser.scss";

interface Customer {
  id: number;
  phone: string;
  name: string;
  gender: "Nam" | "Nữ" | "Khác";
  total: number;
  registrationDate: string;
  rank: string;
  image: string | null;
  address: string | null;
}

const ProfileUser: React.FC = () => {
  const [form] = Form.useForm<Partial<Customer>>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Lấy thông tin user từ auth callback
    MainApiRequest.get<{ data: { phone: string } }>("/auth/callback")
      .then((res) => {
        const phone = res.data.data.phone;
        if (!phone) throw new Error("No phone in callback");
        // 2) Lấy chi tiết customer
        return MainApiRequest.get<Customer>(`/customer/${encodeURIComponent(phone)}`);
      })
      .then((res) => {
        setCustomer(res.data);
        form.setFieldsValue({
          name: res.data.name,
          address: res.data.address || "",
          gender: res.data.gender,
        });
      })
      .catch((err) => {
        console.error("Không tải được profile:", err);
        message.error("Vui lòng đăng nhập lại");
        navigate("/login");
      });
  }, [form, navigate]);

  const onFinish = async (values: Partial<Customer>) => {
    if (!customer) return;
    setLoading(true);
    try {
      await MainApiRequest.put(`/customer/${customer.id}`, {
        name: values.name,
        address: values.address,
        gender: values.gender,
      });
      message.success("Cập nhật hồ sơ thành công");
      // Reload lại data
      const updated = await MainApiRequest.get<Customer>(`/customer/${customer.phone}`);
      setCustomer(updated.data);
      form.setFieldsValue({
        name: updated.data.name,
        address: updated.data.address || "",
        gender: updated.data.gender,
      });
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
      message.error("Cập nhật thất bại, thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return <div className="user-profile loading">Đang tải hồ sơ…</div>;
  }

  return (
    <>
      <Breadcrumbs
        title="Hồ sơ của tôi"
        items={[
          { label: "Trang chủ", to: "/" },
          { label: "Hồ sơ" }
        ]}
      />

      <Row justify="center" className="user-profile">
        <Col xs={24} sm={20} md={12} lg={10}>
          <Card className="profile-card">
            <div className="avatar-section">
              <img
                src={
                  customer.image ||
                  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="avatar"
                className="avatar-img"
              />
              <div className="rank-tag">{customer.rank}</div>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ gender: customer.gender }}
            >
              <Form.Item label="Số điện thoại">
                <Input value={customer.phone} disabled />
              </Form.Item>

              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Nhập họ và tên" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="address" label="Địa chỉ">
                <Input />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: "Chọn giới tính" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Ngày đăng ký">
                <Input
                  value={new Date(customer.registrationDate).toLocaleDateString("vi-VN")}
                  disabled
                />
              </Form.Item>

              <Form.Item label="Tổng chi tiêu">
                <Input
                  value={customer.total.toLocaleString("vi-VN") + "₫"}
                  disabled
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProfileUser;
