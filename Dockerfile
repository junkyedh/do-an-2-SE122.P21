# Stage 1: Build React app using CRACO (with legacy-peer-deps)
FROM node:18-alpine AS builder

# Tạo thư mục làm việc
WORKDIR /app

# Copy file cấu hình cần thiết trước (tối ưu cache Docker)
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY craco.config.js ./

# Cài đặt dependencies với tùy chọn bỏ qua peer conflict
RUN npm install --legacy-peer-deps

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng React
RUN npm run build

# Stage 2: Apache - Serve static files
FROM httpd:2.4-alpine

# Copy build output vào thư mục Apache
COPY --from=builder /app/build /usr/local/apache2/htdocs/

# Thêm file cấu hình Apache để hỗ trợ React Router
COPY apache/default.conf /usr/local/apache2/conf/extra/react.conf
RUN echo "Include conf/extra/react.conf" >> /usr/local/apache2/conf/httpd.conf

# Thêm dòng này để tăng RAM cho node
ENV NODE_OPTIONS=--max-old-space-size=4096
