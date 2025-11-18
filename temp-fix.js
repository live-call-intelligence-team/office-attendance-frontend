import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/TeamChat.jsx';
let content = readFileSync(file, 'utf8');

// Fix the POST endpoint
content = content.replace(
  /await api\.post\('\/messages',\s*{\s*channel:\s*activeChannel,\s*content:\s*messageInput,\s*}\)/,
  'await api.post(`/messages/${activeChannel}`, {\n        content: messageInput,\n      })'
);

writeFileSync(file, content);
console.log('✅ Admin TeamChat fixed!');
