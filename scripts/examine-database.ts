import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗄️ Base de données SFA - Aperçu complet\n');

  // Users
  console.log('👥 Utilisateurs:');
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      firstName: true,
      lastName: true,
      isActive: true,
      status: true,
    }
  });
  console.table(users.map(u => ({
    Email: u.email,
    Role: u.role,
    Nom: `${u.firstName} ${u.lastName}`,
    Actif: u.isActive ? '✅' : '❌',
    Statut: u.status
  })));

  // Territories
  console.log('\n🌍 Territoires:');
  const territories = await prisma.territory.findMany({
    select: {
      code: true,
      name: true,
      level: true,
      isActive: true
    }
  });
  console.table(territories.map(t => ({
    Code: t.code,
    Nom: t.name,
    Niveau: t.level,
    Actif: t.isActive ? '✅' : '❌'
  })));

  // Product Categories
  console.log('\n📦 Catégories Produits:');
  const categories = await prisma.productCategory.findMany();
  console.table(categories.map(c => ({
    Nom: c.name,
    Display: c.displayName,
    Active: c.active ? '✅' : '❌'
  })));

  // Counts
  console.log('\n📊 Compteurs:');
  const userCount = await prisma.user.count();
  const territoryCount = await prisma.territory.count();
  const categoryCount = await prisma.productCategory.count();
  
  console.log(`Utilisateurs: ${userCount}`);
  console.log(`Territoires: ${territoryCount}`);
  console.log(`Catégories produits: ${categoryCount}`);
  console.log(`RefreshTokens: ${await prisma.refreshToken.count()}`);

  console.log('\n✅ Examen base de données terminé');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
