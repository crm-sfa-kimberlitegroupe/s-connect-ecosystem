import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding de la base de données...')

  // Hash du mot de passe par défaut
  const defaultPassword = await bcrypt.hash('SFA2024Admin!', 10)

  // Créer un utilisateur admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sfa.com' },
    update: {},
    create: {
      email: 'admin@sfa.com',
      password: defaultPassword,
      firstName: 'Admin',
      lastName: 'SFA',
      role: 'ADMIN',
      phone: '+221771234567',
      matricule: 'ADM001',
      isActive: true,
      status: 'ACTIVE',
    },
  })

  console.log('✅ Admin créé:', admin.email)

  // Créer un utilisateur manager
  const manager = await prisma.user.upsert({
    where: { email: 'manager@sfa.com' },
    update: {},
    create: {
      email: 'manager@sfa.com',
      password: await bcrypt.hash('SFA2024Manager!', 10),
      firstName: 'Manager',
      lastName: 'SFA',
      role: 'SUP',
      phone: '+221772345678',
      matricule: 'MGR002',
      isActive: true,
      status: 'ACTIVE',
      managerId: admin.id,
    },
  })

  console.log('✅ Manager créé:', manager.email)

  // Créer un utilisateur vendor (représentant)
  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@sfa.com' },
    update: {},
    create: {
      email: 'vendor@sfa.com',
      password: await bcrypt.hash('SFA2024Vendor!', 10),
      firstName: 'Vendor',
      lastName: 'SFA',
      role: 'REP',
      phone: '+221773456789',
      matricule: 'VND001',
      isActive: true,
      status: 'ACTIVE',
      managerId: manager.id,
    },
  })

  console.log('✅ Vendor créé:', vendor.email)

  // Créer un territoire de test
  const territory = await prisma.territory.upsert({
    where: { code: 'TEST-SECTEUR' },
    update: {},
    create: {
      code: 'TEST-SECTEUR',
      name: 'Secteur de Test',
      level: 'SECTEUR',
      lat: 14.7167,
      lng: -17.4677,
      population: 100000,
      superficie: 50.5,
      isActive: true,
    },
  })

  console.log('✅ Territoire créé:', territory.name)

  // Créer une catégorie de produit
  const category = await prisma.productCategory.upsert({
    where: { name: 'Boissons' },
    update: {},
    create: {
      name: 'Boissons',
      displayName: 'Boissons',
      active: true,
    },
  })

  console.log('✅ Catégorie créée:', category.name)

  // Créer un utilisateur simple avec mot de passe simple
  const simplePassword = await bcrypt.hash('admin123', 10);
  const simpleUser = await prisma.user.upsert({
    where: { email: 'simple@test.com' },
    update: {},
    create: {
      email: 'simple@test.com',
      password: simplePassword,
      firstName: 'Simple',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+221777777777',
      matricule: 'SIM001',
      isActive: true,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Utilisateur simple créé:', simpleUser.email)

  console.log('🎉 Seeding terminé avec succès!')
  console.log('📝 Identifiants de login:')
  console.log('   Admin: admin@sfa.com / SFA2024Admin!')
  console.log('   Manager: manager@sfa.com / SFA2024Manager!')
  console.log('   Vendor: vendor@sfa.com / SFA2024Vendor!')
  console.log('   Simple: simple@test.com / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })