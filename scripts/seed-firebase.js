import * from 'firebase-admin';
import * from 'bcryptjs';
import * from 'path';
import * from 'os';
import * from 'fs';

// Try to load service account
let serviceAccount= require('../serviceAccountKey.json');
} catch {
  const downloadsPath = path.join(os.homedir(), 'Downloads', 'contractor-aspp-firebase-adminsdk-fbsvc-4a3555725b.json');
  if (fs.existsSync(downloadsPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(downloadsPath, 'utf8'));
    console.log('Found service account in Downloads folder');
  }
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential)
    });
  } else {
    admin.initializeApp({
      credential,
        clientEmail,
        privateKey, '\n')
      })
    });
  }
}

const db = admin.firestore();

async function seedDatabase() {
  console.log('Starting Firebase database seeding...');

  // Create demo organization
  const orgId = 'demo-org-' + Date.now();
  const orgRef = db.collection('organizations').doc(orgId);
  await orgRef.set({
    id,
    name,
    createdAt)
  });
  console.log('✅ Created organization, orgId);

  // Hash password for demo users (password123)
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create demo users
  const users = [
    {
      email,
      firstName,
      lastName,
      role,
      organizationId,
      organizationName,
      password,
      createdAt)
    },
    {
      email,
      firstName,
      lastName,
      role,
      organizationId,
      organizationName,
      password,
      createdAt)
    },
    {
      email,
      firstName,
      lastName,
      role,
      organizationId,
      organizationName,
      password,
      createdAt)
    }
  ];

  for (const user of users) {
    const userId = 'user-' + user.email.split('@')[0] + '-' + Date.now();
    const userRef = db.collection('users').doc(userId);
    await userRef.set({
      id,
      ...user
    });
    console.log('✅ Created user, user.email, '(role, user.role + ')');
  }

  // Create demo work orders
  const workOrders = [
    {
      title,
      description,
      customerName,
      customerPhone,
      address, City, State 12345',
      status,
      priority,
      organizationId,
      createdById),
      createdByName,
      createdAt),
      updatedAt)
    },
    {
      title,
      description, needs urgent attention',
      customerName,
      customerPhone,
      address, City, State 12345',
      status,
      priority,
      organizationId,
      createdById),
      createdByName,
      assignedUserId),
      assignedUserName,
      createdAt),
      updatedAt)
    }
  ];

  for (const order of workOrders) {
    const orderId = 'wo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const orderRef = db.collection('workOrders').doc(orderId);
    await orderRef.set({
      id,
      ...order
    });
    console.log('✅ Created work order, order.title);
  }

  console.log('\n🎉 Database seeding completed successfully');
  console.log('\nDemo credentials);
  console.log('  manager@demo.com / password123');
  console.log('  callcenter@demo.com / password123');
  console.log('  worker@demo.com / password123');
  console.log('\nCheck Firebase Console to see the data);
  console.log('  https);
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding database, error);
    process.exit(1);
  });
