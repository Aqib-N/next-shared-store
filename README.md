echo "# Next Shared Store

A lightweight state-sharing utility for Next.js that enables seamless data flow between pages — no localStorage, Redux, or Context API needed.

## 🚀 Installation

\`\`\`bash
npm install next-shared-store
\`\`\`

## 🧠 Usage

### Store data in one page

\`\`\`tsx
import { setSharedData } from 'next-shared-store';

setSharedData('about', { title: 'Company Vision' });
\`\`\`

### Access it on another page

\`\`\`tsx
import { useSharedData } from 'next-shared-store';

const [data] = useSharedData('about');
console.log(data); // { title: 'Company Vision' }
\`\`\`

## ⚙️ Features

- 🔁 Share data between pages instantly
- 🧩 Optional sessionStorage persistence
- ⚡ Zero dependencies
- 🪶 Tiny (under 2KB)

## 🧩 License

MIT © [Aqib Nawaz](https://github.com/Aqib-N)
" > README.md
