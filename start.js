#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 === DÉMARRAGE DE L\'APPLICATION ===\n');

function run(command, description) {
  console.log(`\n📌 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      env: { 
        ...process.env, 
        NODE_ENV: 'production'
      } 
    });
    console.log(`✅ ${description} - Succès`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} - Échec`);
    console.error(error.message);
    return false;
  }
}

try {
  // Vérifier les variables d'environnement critiques
  console.log('🔍 Vérification des variables d\'environnement...');
  
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`❌ Variables d'environnement manquantes: ${missingVars.join(', ')}`);
    process.exit(1);
  }
  
  console.log('✅ Variables d\'environnement OK');
  
  // Générer le client Prisma (au cas où)
  run('npx prisma generate', 'Génération du client Prisma');
  
  // Déployer les migrations (seulement si DIRECT_URL est configurée)
  if (process.env.DIRECT_URL) {
    console.log('\n📊 Vérification de la base de données...');
    const migrationResult = run('npx prisma migrate deploy', 'Application des migrations');
    if (!migrationResult) {
      console.log('⚠️  Les migrations ont échoué, mais on continue...');
    }
  } else {
    console.log('\n⚠️  DIRECT_URL non configurée — migrations ignorées');
  }
  
  // Démarrer l'application
  console.log('\n🎯 Démarrage de l\'application NestJS...');
  console.log('📍 Port:', process.env.PORT || 3001);
  console.log('🌍 Environnement:', process.env.NODE_ENV || 'development');
  
  // Importer et démarrer l'application NestJS
  const { createApp } = require('./dist/main.js');
  createApp().then(app => {
    const port = process.env.PORT || 3001;
    return app.listen(port, '0.0.0.0');
  }).then(() => {
    const port = process.env.PORT || 3001;
    console.log(`🚀 Application running on port ${port}`);
    console.log(`📚 Swagger docs: http://0.0.0.0:${port}/api/docs`);
  }).catch(err => {
    console.error('💥 Erreur au démarrage de NestJS:', err.message);
    console.error(err.stack);
    process.exit(1);
  });
  
} catch (error) {
  console.error('\n💥 ERREUR CRITIQUE LORS DU DÉMARRAGE');
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}
