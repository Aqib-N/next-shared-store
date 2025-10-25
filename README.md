# Next Shared State 🚀

Enhanced state sharing for Next.js with IndexedDB persistence and URL data transfer between static and dynamic pages.

## ✨ Features

- 🗂️ **Cross-Page State Sharing** - Share data between any components and pages
- 💾 **IndexedDB Persistence** - Long-term storage with automatic expiration
- 🔗 **URL Data Transfer** - Seamlessly pass data from static to dynamic pages
- ⏱️ **TTL Support** - Automatic data cleanup with human-readable time formats
- 🏷️ **Data Categorization** - Organize and manage data by categories
- 🔄 **Real-time Sync** - BroadcastChannel for cross-tab communication
- 📱 **TypeScript Ready** - Full type definitions and IntelliSense
- 🪶 **Lightweight** - Zero dependencies, minimal footprint

## 🚀 Installation

```bash
npm install next-shared-state
```

## 📖 Quick Start

### Basic Usage

```bash
// components/UserProfile.jsx
import { useSharedData } from 'next-shared-state';

export default function UserProfile() {
  const [user, setUser] = useSharedData('user', { name: '', email: '' });

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
      />
    </div>
  );
}
```

### Access from Any Page

```bash
// pages/dashboard.jsx
import { useSharedData } from 'next-shared-state';

export default function Dashboard() {
  const [user] = useSharedData('user');

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## 🎯 Core API

- **useSharedData(key, initialValue?, options?)**

React hook for accessing and updating shared data.

```bash
const [data, setData] = useSharedData('key', initialValue, {
  persist: 'indexedDB', // 'indexedDB' | 'url' | 'memory'
  ttl: '1day',         // Time to live
  category: 'user'     // Data category
});
```

- **setSharedData(key, value, options?)**

Programmatically set shared data.

```bash
import { setSharedData } from 'next-shared-state';

setSharedData('cart', { items: [] }, {
  persist: 'indexedDB',
  ttl: '2hours'
});
```

## 🔄 Persistence Options

**1. IndexedDB (Long-term Storage)**

```bash
// User preferences - store permanently
const [prefs, setPrefs] = useSharedData('preferences', {
  theme: 'dark',
  language: 'en'
}, {
  persist: 'indexedDB',
  category: 'settings'
});

// Shopping cart - store for 24 hours
const [cart, setCart] = useSharedData('cart', [], {
  persist: 'indexedDB',
  ttl: '24hours', // or TTL.long
  category: 'commerce'
});
```

**1. IndexedDB (Long-term Storage)**

```bash
// Static page - send data to dynamic page
import { createTransferURL } from 'next-shared-state';

export default function ProductList() {
  const handleViewProduct = (product) => {
    const url = createTransferURL('/product-details', {
      productId: product.id,
      productName: product.name
    });
    window.location.href = url;
  };

  return <button onClick={() => handleViewProduct(product)}>View Details</button>;
}
```

```bash
// Dynamic page - receive data automatically
export default function ProductDetails() {
  // Data automatically extracted from URL
  const [productData] = useSharedData('productData');

  return (
    <div>
      <h1>{productData?.productName}</h1>
      <p>ID: {productData?.productId}</p>
    </div>
  );
}
```

**3. Memory Only (Temporary)**

```bash
// Temporary UI state
const [isOpen, setIsOpen] = useSharedData('modalState', false, {
  persist: 'memory' // Clears on page refresh
});
```

## ⏰ TTL (Time To Live) Examples

**Using Presets**

```bash
import { TTL } from 'next-shared-state';

// Various TTL examples
const [session] = useSharedData('session', {}, {
  ttl: TTL.short,     // 30 minutes
  persist: 'indexedDB'
});

const [cache] = useSharedData('cache', {}, {
  ttl: TTL.medium,    // 1 day
  persist: 'indexedDB'
});

const [prefs] = useSharedData('prefs', {}, {
  ttl: TTL.forever,   // Never expires
  persist: 'indexedDB'
});
```

**Human-Readable Formats**

```bash
// All these formats work:
const [data1] = useSharedData('key', value, { ttl: '30min' });
const [data2] = useSharedData('key', value, { ttl: '2 hours' });
const [data3] = useSharedData('key', value, { ttl: '3 days' });
const [data4] = useSharedData('key', value, { ttl: 3600000 }); // milliseconds
const [data5] = useSharedData('key', value, { ttl: 60 }); // minutes (assumed)
```

## 🗂️ Data Management

**Clear Data by Category**

```bash
import { clearPersistedData } from 'next-shared-state';

// Clear all temporary data
await clearPersistedData('temp');

// Clear all user-related data
await clearPersistedData('user');

// Clear everything
await clearPersistedData();
```

**Export/Import Data**

```bash
import { exportAllData, importData } from 'next-shared-state';

// Backup all data
const backup = await exportAllData();
localStorage.setItem('backup', backup);

// Restore data
const saved = localStorage.getItem('backup');
if (saved) {
  await importData(saved);
}
```

**Get All Stored Keys**

```bash
import { getPersistedKeys } from 'next-shared-state';

const keys = await getPersistedKeys();
console.log(keys); // ['user', 'cart', 'preferences']
```

## 🔧 Advanced Usage

**Direct IndexedDB Access**

```bash
import { indexedDBStore } from 'next-shared-state';

// Advanced operations
await indexedDBStore.set('key', value, {
  ttl: 3600000,
  category: 'custom'
});

const data = await indexedDBStore.get('key');
await indexedDBStore.remove('key');
```

**Cross-Tab Synchronization**

Data automatically syncs between browser tabs using BroadcastChannel when using persist: `indexedDB`.

## 🎯 Real-World Examples

**E-commerce Shopping Cart**

```bash
// Add to cart from any page
const [cart, setCart] = useSharedData('cart', [], {
  persist: 'indexedDB',
  ttl: '7days',
  category: 'commerce'
});

const addToCart = (product) => {
  setCart([...cart, product]);
};

// Cart persists across page refreshes and browser sessions
```

**Multi-Step Form**

```bash
// Step 1
const [formData, setFormData] = useSharedData('application', {}, {
  persist: 'indexedDB',
  ttl: '1hour',
  category: 'forms'
});

// Step 2 - data is automatically available
const [savedForm] = useSharedData('application');
```

**User Preferences**

```bash
// Settings saved permanently
const [settings, setSettings] = useSharedData('settings', {
  theme: 'light',
  notifications: true,
  language: 'en'
}, {
  persist: 'indexedDB',
  category: 'preferences'
});
```

## 📚 API Reference

**TTL Presets**

```bash
TTL['5min']      // 5 minutes
TTL['1hour']     // 1 hour
TTL['1day']      // 24 hours
TTL['1week']     // 7 days
TTL['1month']    // 30 days
TTL.forever      // No expiration

// Convenience aliases
TTL.short        // 30 minutes
TTL.medium       // 1 day
TTL.long         // 1 week
TTL.veryLong     // 1 month
```

**Store Options**

| Option     | Type                         | Default     | Description    |
| :--------- | :--------------------------- | :---------- | :------------- |
| `persist`  | `'indexedDB' 'url' 'memory'` | `'memory'`  | Storage method |
| `ttl`      | `'string' 'number'`          | `undefined` | Time to live   |
| `category` | `string	`                     | `'default'` | Data category  |

## 🔍 TypeScript Support

Full TypeScript support with complete type definitions:

```bash
import { useSharedData, StoreOptions } from 'next-shared-state';

interface User {
  id: string;
  name: string;
  email: string;
}

const [user, setUser] = useSharedData<User>('user', {
  id: '',
  name: '',
  email: ''
});

const options: StoreOptions = {
  persist: 'indexedDB',
  ttl: '1day',
  category: 'users'
};
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/Aqib-N/next-shared-store/blob/main/CONTRIBUTING.md) for details.

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/Aqib-N/next-shared-store/issues) on GitHub.

## 📄 License

MIT © [Aqib Nawaz](https://github.com/Aqib-N)
