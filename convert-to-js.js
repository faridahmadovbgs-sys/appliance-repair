const fs = require('fs');
const path = require('path');

// Files to convert
const files = [
  'src/proxy.ts',
  'src/context/AuthContext.tsx',
  'src/lib/prisma.ts',
  'src/lib/firestore.ts',
  'src/lib/firestore-old.ts',
  'src/lib/firestore-demo.ts',
  'src/lib/firebase.ts',
  'src/lib/current-user.ts',
  'src/lib/auth-token.ts',
  'scripts/seed-firebase.ts',
  'prisma.config.ts',
  'src/hooks/useNotifications.ts',
  'prisma/seed.ts',
  'src/components/PWAInstallPrompt.tsx',
  'src/components/OrderList.tsx',
  'src/components/NotificationPrompt.tsx',
  'src/components/Dashboard.tsx',
  'src/components/CreateOrderForm.tsx',
  'src/components/AssignOrderModal.tsx',
  'src/app/api/login/route.ts',
  'src/app/page.tsx',
  'src/app/register/page.tsx',
  'src/app/layout.tsx',
  'src/app/api/test/route.ts',
  'src/app/api/logout/route.ts',
  'src/app/history/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/forgot-password/page.tsx',
  'src/app/api/work-orders/[id]/route.ts',
  'src/app/api/work-orders/route.ts',
  'src/app/api/auth/me/route.ts',
  'src/app/login/page.tsx',
  'src/app/api/users/workers/route.ts',
  'src/app/api/auth/forgot-password/route.ts',
  'src/app/api/auth/register/route.ts'
];

function removeTypeAnnotations(content) {
  // Remove import type statements
  content = content.replace(/import\s+type\s+\{[^}]+\}\s+from\s+['"][^'"]+['"]\s*;?\s*/g, '');
  content = content.replace(/import\s+type\s+[^\s]+\s+from\s+['"][^'"]+['"]\s*;?\s*/g, '');
  
  // Remove type imports from regular imports
  content = content.replace(/import\s+\{([^}]*?)type\s+([^,}]+)([^}]*?)\}/g, 'import {$1$3}');
  
  // Remove interface declarations (basic)
  content = content.replace(/^export\s+interface\s+\w+\s*\{[^}]*\}\s*$/gm, '');
  content = content.replace(/^interface\s+\w+\s*\{[^}]*\}\s*$/gm, '');
  
  // Remove type declarations
  content = content.replace(/^export\s+type\s+\w+\s*=\s*[^;]+;\s*$/gm, '');
  content = content.replace(/^type\s+\w+\s*=\s*[^;]+;\s*$/gm, '');
  
  // Remove function parameter types (: Type)
  content = content.replace(/(\w+)\s*:\s*[^,)=]+/g, '$1');
  
  // Remove function return types
  content = content.replace(/\)\s*:\s*[^{=>\n]+(\s*[{=>\n])/g, ')$1');
  
  // Remove variable type annotations
  content = content.replace(/:\s*\w+(\[\])?(\s*[=;,)])/g, '$2');
  
  // Remove generic type parameters
  content = content.replace(/<[^>]+>/g, '');
  
  // Remove as Type assertions
  content = content.replace(/\s+as\s+\w+(\[\])?\s*/g, ' ');
  
  // Remove ! non-null assertions
  content = content.replace(/(\w+)!/g, '$1');
  
  // Clean up excessive whitespace
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  return content;
}

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Remove type annotations
  content = removeTypeAnnotations(content);
  
  // Determine new extension
  const newExt = file.endsWith('.tsx') ? '.jsx' : '.js';
  const newFile = file.replace(/\.tsx?$/, newExt);
  const newFullPath = path.join(__dirname, newFile);
  
  // Write converted file
  fs.writeFileSync(newFullPath, content, 'utf8');
  
  // Delete old file if different name
  if (fullPath !== newFullPath) {
    fs.unlinkSync(fullPath);
  }
  
  console.log(`Converted ${file} -> ${newFile}`);
});

console.log('\nConversion complete!');
