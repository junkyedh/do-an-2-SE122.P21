# Cafe W Fen - Coffee Chain Management System

## Introduction
Cafe W Fen is a centralized management platform designed for coffee shop chains. The system streamlines business operations at each branch while providing comprehensive oversight for the entire chain. It covers product management, order processing, inventory control, user roles, revenue tracking, and profit statistics, ensuring accuracy, flexibility, and scientific management.

## Features
- **Centralized Management:** Manage all branches, employees, products, materials, orders, and customers from a single platform.
- **Role-Based Access:** Supports System Admin, Branch Admin, Staff, and Customer roles with strict permission controls.
- **Order Management:** Real-time tracking for dine-in and take-away orders.
- **Inventory Management:** Track stock levels, manage imports/exports, and receive low-stock alerts per branch.
- **Modern Payments:** Integrates QR code, e-wallets (MoMo, VNPay), and bank transfers.
- **Smart Reporting:** Revenue, profit, best-selling products, staff performance, and customer statistics by day, week, or month.
- **Scalable Design:** Ready for future features like loyalty points, accounting/CRM integration, and multi-platform support (Web & Mobile).

## System Scope
- Multi-branch, multi-role architecture.
- Independent branch operations with centralized reporting.
- Flexible user permissions and data separation.
- Designed for System Admins, Branch Admins, Staff, and Customers.

## Main Functions
- **Employee Management:** Track staff by branch, manage shifts, and calculate salaries automatically.
- **Branch Management:** Maintain branch details, update information, and aggregate data for reporting.
- **Inventory Management:** Monitor ingredients, set minimum stock thresholds, and allocate materials per branch.
- **Sales Management:** Manage menu, orders (dine-in/take-away), table status, and automatic invoice generation.
- **Revenue & Reporting:** Track all financial activities, generate customizable reports, and analyze business performance.
- **Customer Management:** Store customer info and apply discounts based on spending tiers.

## Prerequisites
- [Node.js](https://nodejs.org/) >= 14.x
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) or your configured database
- (Optional) [Docker](https://www.docker.com/) for containerized deployment

## Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/cafe-w-fen.git
    cd cafe-w-fen
    ```
2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3. **Configure environment variables:**  
    Copy `.env.example` to `.env` and update with your settings.

## How to Run
- **Development mode:**
  ```bash
  npm run dev
  # or
  yarn dev
  ```
- **Production build:**
  ```bash
  npm run build
  npm start
  ```
- **Docker (optional):**
  ```bash
  docker-compose up --build
  ```

## How to Contribute
1. Fork this repository.
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request.

## Acknowledgements
- Inspired by real-world coffee chain management needs.
- Thanks to all contributors and open-source libraries used in this project.

## License
This project is licensed under the [MIT License](LICENSE).

