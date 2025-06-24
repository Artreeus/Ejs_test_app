# 🧪 ExpressJS REST API Test Suite

<div align="center">

![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-FB015B?style=for-the-badge)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white)

**A comprehensive test suite for JWT-authenticated REST APIs with a beautiful web interface**

[Features](#features) • [Installation](#setup) • [Usage](#usage) • [API Documentation](#api-endpoints) • [Testing](#testing) • [Contributing](#contributions)

</div>

## ✨ Features

### 🎯 **Core Functionality**
- **JWT Authentication** - Secure user registration and login
- **Protected Routes** - Token-based access control
- **CRUD Operations** - Complete product management
- **Input Validation** - Comprehensive data validation with Joi
- **Rate Limiting** - API protection against abuse
- **Password Encryption** - bcrypt hashing for security

### 🧪 **Testing Suite**
- **Automated Testing** - Comprehensive Mocha/Chai test coverage
- **Real-time Execution** - Run tests with live progress tracking
- **Visual Results** - Beautiful Bootstrap-styled test results
- **Test Categories** - Authentication, Protected Routes, CRUD operations
- **Error Handling** - Detailed error reporting and debugging

### 🎨 **Web Interface**
- **Modern UI** - Bootstrap 5 with custom styling
- **Responsive Design** - Mobile-friendly interface
- **Progress Tracking** - Real-time test execution progress
- **Interactive Dashboard** - One-click test execution
- **Results Visualization** - Charts, badges, and detailed reports

## 🚀 Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/udz-codes/express-rest-boilerplate.git
cd express-rest-boilerplate
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
PORT=3000
DB_URL=mongodb://localhost:27017/testdb
JWT_SECRET=your-super-secret-jwt-key-here
```

5. **Start the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🎯 Usage

### Web Interface
1. Navigate to `http://localhost:3000/test`
2. Click "Run All Tests" to execute the test suite
3. View real-time progress and results
4. Access detailed results at `/test/results`

### Command Line Testing
```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch
```

## 📋 API Endpoints

| **Endpoint** | **Method** | **Purpose** | **Auth Required** |
|--------------|------------|-------------|-------------------|
| `/` | GET | Homepage | ❌ |
| `/api/user/register` | POST | User registration | ❌ |
| `/api/user/login` | POST | User login | ❌ |
| `/api/private` | GET | Protected route example | ✅ |
| `/api/examples/pagination/products` | GET | Get products with pagination | ❌ |
| `/api/examples/pagination/products` | POST | Create new product | ✅ |
| `/api/examples/pagination/products` | PUT | Update product | ✅ |
| `/api/examples/pagination/products` | DELETE | Delete product | ✅ |

### Test Interface Endpoints
| **Endpoint** | **Method** | **Purpose** |
|--------------|------------|-------------|
| `/test` | GET | Test dashboard |
| `/test/run` | POST | Execute test suite |
| `/test/results` | GET | View test results |
| `/test/api/results` | GET | Get results as JSON |

## 🧪 Testing

### Test Coverage

#### Authentication Tests (7 tests)
- ✅ User registration with valid data
- ✅ Invalid email format rejection
- ✅ Weak password rejection
- ✅ Missing required fields
- ✅ Duplicate user prevention
- ✅ Successful login with JWT
- ✅ Invalid credentials handling

#### Protected Routes Tests (12 tests)
- ✅ JWT token validation
- ✅ Access control verification
- ✅ CRUD operations security
- ✅ Invalid token handling
- ✅ Product management operations
- ✅ Pagination functionality

### Test Categories

```
📊 Test Statistics
├── 🔐 Authentication Tests: 7 tests
├── 🛡️  Protected Routes Tests: 12 tests
├── 📦 CRUD Operations Tests: 8 tests
└── 🎯 Total Coverage: 19 tests
```

## 🏗️ Project Structure

```
express-rest-boilerplate/
├── 📄 app.js                    # Main application
├── 📄 package.json             # Dependencies & scripts
├── 📄 .env.example             # Environment template
├── 📄 validations.js           # Input validation schemas
│
├── 📁 models/                  # Database models
│   ├── UserModel.js
│   └── ProductModel.js
│
├── 📁 routes/                  # API routes
│   ├── auth.js                 # Authentication
│   ├── privateRoutes.js        # Protected routes
│   ├── test.js                 # Test interface
│   └── examples/
│       └── paginationExample.js
│
├── 📁 middlewares/             # Custom middlewares
│   ├── rateLimiter.js
│   └── verifyToken.js
│
├── 📁 views/                   # EJS templates
│   ├── layouts/layout.ejs      # Main layout
│   ├── partials/               # Reusable components
│   ├── index.ejs              # Test dashboard
│   └── results.ejs            # Results page
│
├── 📁 test/                    # Test suite
│   ├── auth.test.js           # Authentication tests
│   ├── protected.test.js      # Protected routes tests
│   └── helpers/testHelper.js  # Test utilities
│
└── 📁 public/                  # Static assets
    ├── css/style.css          # Custom styles
    ├── js/app.js             # Frontend JavaScript
    └── images/               # Static images
```

## 🛠️ Technology Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation

### Frontend
- **EJS** - Template engine
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons
- **Vanilla JavaScript** - Client-side logic

### Testing
- **Mocha** - Test framework
- **Chai** - Assertion library
- **Chai-HTTP** - HTTP integration testing

## 📝 Environment Variables

```env
# Server Configuration
PORT=3000                              # Server port

# Database Configuration  
DB_URL=mongodb://localhost:27017/testdb # MongoDB connection string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key    # JWT signing secret

# Optional
NODE_ENV=development                    # Environment mode
```

## 🤝 Contributions

We welcome contributions! Please see [Contributing.md](Contributing.md) for guidelines.

### Current Contributors
<a href="https://github.com/udz-codes/express-rest-boilerplate/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=udz-codes/express-rest-boilerplate" />
</a>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Express.js and MongoDB
- UI inspired by modern web design principles
- Testing methodology based on industry best practices

---

<div align="center">

**[⭐ Star this repository](https://github.com/udz-codes/express-rest-boilerplate)** if you find it helpful!

Made with ❤️ by [Ujjwaldeep Singh](https://github.com/udz-codes)

</div>#   E j s _ t e s t _ a p p 
 
 #   E j s _ t e s t _ a p p 
 
 
