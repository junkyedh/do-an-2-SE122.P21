"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Breadcrumbs from "@/components/littleComponent/Breadcrumbs/Breadcrumbs"
import { MainApiRequest } from "@/services/MainApiRequest"
import "./ProfileUser.scss"
import { User, Phone, Calendar, Award, Camera, Edit3, Save, X } from "lucide-react"
import { Button } from "@/components/littleComponent/Button/Button"

interface Customer {
  id: number
  phone: string
  name: string
  gender: "Nam" | "Nữ" | "Khác"
  total: number
  registrationDate: string
  rank: string
  image: string | null
  address: string | null
}

const ProfileUser: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gender: "Nam" as "Nam" | "Nữ" | "Khác",
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await MainApiRequest.get<{ data: { phone: string } }>("/auth/callback")
        const phone = res.data.data.phone
        if (!phone) throw new Error("No phone in callback")

        const customerRes = await MainApiRequest.get<Customer>(`/customer/${encodeURIComponent(phone)}`)
        setCustomer(customerRes.data)
        setFormData({
          name: customerRes.data.name,
          address: customerRes.data.address || "",
          gender: customerRes.data.gender,
        })
      } catch (err) {
        console.error("Không tải được profile:", err)
        navigate("/login")
      }
    }

    fetchProfile()
  }, [navigate])

  const handleSave = async () => {
    if (!customer) return
    setLoading(true)
    try {
      await MainApiRequest.put(`/customer/${customer.id}`, formData)

      const updated = await MainApiRequest.get<Customer>(`/customer/${customer.phone}`)
      setCustomer(updated.data)
      setFormData({
        name: updated.data.name,
        address: updated.data.address || "",
        gender: updated.data.gender,
      })
      setEditing(false)
    } catch (err) {
      console.error("Cập nhật thất bại:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (customer) {
      setFormData({
        name: customer.name,
        address: customer.address || "",
        gender: customer.gender,
      })
    }
    setEditing(false)
  }

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "bronze":
        return "#cd7f32"
      case "silver":
        return "#c0c0c0"
      case "gold":
        return "#ffd700"
      case "platinum":
        return "#e5e4e2"
      case "diamond":
        return "#b9f2ff"
      default:
        return "#6b7280"
    }
  }

  const getRankIcon = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "bronze":
        return "🥉"
      case "silver":
        return "🥈"
      case "gold":
        return "🥇"
      case "platinum":
        return "💎"
      case "diamond":
        return "💠"
      default:
        return "⭐"
    }
  }

  if (!customer) {
    return (
      <div className="profile-user">
        <div className="container">
          <div className="profile-user__loading">
            <div className="loading-spinner"></div>
            <p>Đang tải hồ sơ...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Breadcrumbs title="Hồ sơ của tôi" items={[{ label: "Trang chủ", to: "/" }, { label: "Hồ sơ" }]} />

      <div className="profile-user">
        <div className="container">
          <div className="profile-user__content">
            {/* Avatar & Stats Section */}
            <div className="profile-user__sidebar">
              <div className="avatar-card">
                <div className="avatar-section">
                  <div className="avatar-wrapper">
                    <img
                      src={customer.image || "/placeholder.svg?height=120&width=120"}
                      alt="avatar"
                      className="avatar-img"
                    />
                    <button className="avatar-edit-btn">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="user-info">
                    <h2 className="user-name">{customer.name}</h2>
                    <div
                      className="rank-badge"
                      style={{
                        background: `linear-gradient(135deg, ${getRankColor(customer.rank)}20, ${getRankColor(customer.rank)}40)`,
                        border: `2px solid ${getRankColor(customer.rank)}60`,
                      }}
                    >
                      <span className="rank-icon">{getRankIcon(customer.rank)}</span>
                      <span className="rank-text">{customer.rank}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h3>Thống kê</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon">
                      <Calendar size={20} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Ngày tham gia</div>
                      <div className="stat-value">
                        {new Date(customer.registrationDate).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">
                      <Award size={20} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-label">Tổng chi tiêu</div>
                      <div className="stat-value">{customer.total.toLocaleString("vi-VN")}₫</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form Section */}
            <div className="profile-user__main">
              <div className="profile-form-card">
                <div className="card-header">
                  <h3>Thông tin cá nhân</h3>
                  <div className="header-actions">
                    {!editing ? (
                      <Button 
                        variant="ghost"
                        size="sm" 
                        className="primaryBtn"  
                        onClick={() => setEditing(true)}>
                        <Edit3 size={16} />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <div className="edit-actions">
                        <Button
                          variant="ghost"
                          size="sm" 
                          className="secondaryBtn" onClick={handleCancel}>
                          <X size={16} className="" />
                          Hủy
                        </Button>
                        <Button                           
                          variant="ghost"
                          size="sm" 
                          className="primaryBtn" onClick={handleSave} disabled={loading}>
                          <Save size={16} />
                          {loading ? "Đang lưu..." : "Lưu"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        <Phone size={16} />
                        Số điện thoại
                      </label>
                      <input className="form-input" value={customer.phone} disabled />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <User size={16} />
                        Họ và tên
                      </label>
                      <input
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!editing}
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Địa chỉ</label>
                      <input
                        className="form-input"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!editing}
                        placeholder="Nhập địa chỉ"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Giới tính</label>
                      <select
                        className="form-input"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Nam" | "Nữ" | "Khác" })}
                        disabled={!editing}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ngày đăng ký</label>
                      <input
                        className="form-input"
                        value={new Date(customer.registrationDate).toLocaleDateString("vi-VN")}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tổng chi tiêu</label>
                      <input className="form-input" value={customer.total.toLocaleString("vi-VN") + "₫"} disabled />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileUser
