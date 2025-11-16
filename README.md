# SpendWise - Personal Finance Tracker

SpendWise is a modern, intuitive personal finance tracking application built with React and Firebase. Track your income and expenses, visualize your spending habits, and take control of your financial future.

![SpendWise](https://img.shields.io/badge/version-0.1.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-11.8.1-FFCA28?logo=firebase)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

- **Transaction Management**: Easily add, edit, and delete income and expense transactions
- **Visual Analytics**: Interactive charts (Pie & Bar charts) to visualize your financial data
- **Category Tracking**: Organize transactions with predefined categories for better insights
- **Monthly Savings**: Track and save monthly financial summaries automatically
- **Auto-Save**: Automatic monthly data archiving for long-term tracking
- **Data Export**: Export your transactions to CSV for external analysis
- **Undo Functionality**: Revert your last action with a single click
- **Authentication**: Secure login with email/password or social providers (Google, Facebook, GitHub)
- **Responsive Design**: Beautiful UI that works seamlessly on desktop and mobile devices
- **Real-time Sync**: All data synced in real-time across devices using Firebase

## 🚀 Tech Stack

- **Frontend**: React 19.1.0 with Vite
- **Styling**: Tailwind CSS 4.1.7
- **Charts**: Chart.js 4.4.9 with React-Chartjs-2
- **Backend**: Firebase (Authentication & Firestore Database)
- **Routing**: React Router DOM 7.6.0
- **Date Handling**: date-fns 4.1.0, react-datepicker 8.3.0
- **Icons**: React Icons 5.5.0
- **Notifications**: React Toastify 11.0.5

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- A **Firebase account** (free tier is sufficient)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tharun067/spendwise.git
cd spendwise
```

### 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. Firebase Configuration

#### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "SpendWise")
4. (Optional) Enable Google Analytics
5. Click **"Create project"** and wait for the setup to complete

#### Step 2: Enable Authentication

1. In your Firebase project, navigate to **Build** → **Authentication**
2. Click **"Get started"**
3. Enable the following sign-in methods:
   - **Email/Password**: Click on it and enable
   - **Google**: Click on it, enable, and provide a support email
   - **Facebook** (optional): Enable and add your Facebook App ID and secret
   - **GitHub** (optional): Enable and add your GitHub OAuth credentials

#### Step 3: Create Firestore Database

1. Navigate to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (you can adjust rules later)
4. Select a Cloud Firestore location (choose one closest to your users)
5. Click **"Enable"**

#### Step 4: Set Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Monthly Savings collection
    match /monthlySavings/{savingsId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **"Publish"**

#### Step 5: Get Firebase Configuration

1. In Firebase Console, click on the **⚙️ Settings** icon → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click on the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "SpendWise Web")
5. Copy the Firebase configuration object

It will look something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

#### Step 6: Configure Environment Variables

1. Create a `.env` file in the root directory of the project:

```bash
touch .env
```

2. Add your Firebase configuration to the `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

**Important**: Never commit your `.env` file to version control. Make sure `.env` is listed in your `.gitignore` file.

### 4. Run the Development Server

```bash
npm run dev
```

or

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

or

```bash
yarn build
```

To preview the production build locally:

```bash
npm run preview
```

## 🗂️ Project Structure

```
spendwise/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   ├── DashboardHeader.jsx
│   │   ├── FinancialCharts.jsx
│   │   ├── FinancialSummary.jsx
│   │   ├── Layout.jsx
│   │   ├── Logo.jsx
│   │   ├── MonthlyAutoSave.jsx
│   │   ├── MonthlySavingsView.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TransactionForm.jsx
│   │   └── TransactionList.jsx
│   ├── contexts/        # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── MonthlySavingsContext.jsx
│   │   └── TransactionContext.jsx
│   ├── firebase/        # Firebase configuration
│   │   └── config.js
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useMonthlySavings.js
│   │   └── useTransactions.js
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Login.jsx
│   │   ├── MonthlySavings.jsx
│   │   ├── NotFound.jsx
│   │   └── Signup.jsx
│   ├── App.jsx          # Main App component
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── .env                 # Environment variables (not in repo)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 💡 Usage

### Adding Transactions

1. Click **"Add Income"** or **"Add Expense"** button on the dashboard
2. Fill in the transaction details:
   - Name/Description
   - Amount
   - Date
   - Category
3. Click **"Add Transaction"**

### Viewing Analytics

- Navigate through different chart views using the **"Pie Chart"** and **"Bar Chart"** toggle buttons
- View three analytical charts:
  - Income vs Expenses
  - Income by Category
  - Expenses by Category

### Monthly Savings

1. Click the **"Save Month"** button to manually save your current month's data
2. Navigate to **"Monthly Savings"** to view historical monthly summaries
3. Auto-save feature automatically archives data at the end of each month

### Managing Data

- **Undo**: Revert your last transaction action
- **Reset**: Clear all transactions (with confirmation)
- **Export**: Download your transactions as a CSV file

## 🔒 Security

- All user data is protected by Firebase Authentication
- Firestore security rules ensure users can only access their own data
- Environment variables keep sensitive configuration secure
- Password authentication uses Firebase's secure authentication system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Tharun067**
- GitHub: [@tharun067](https://github.com/tharun067)

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Chart.js for beautiful data visualizations
- React Icons for the icon library
- Tailwind CSS for styling utilities

## 📧 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

---

Made with ❤️ by Tharun067
