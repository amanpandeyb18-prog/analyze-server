// Update existing file URLs to use API endpoint instead of direct SAS URLs
// Run with: npx tsx scripts/update-file-urls.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateFileUrls() {
  console.log('🔄 Updating file URLs to use API endpoint...');

  try {
    // Get all files
    const files = await prisma.file.findMany();

    console.log(`📊 Found ${files.length} files to update`);

    let updated = 0;
    for (const file of files) {
      // Update URL to use API endpoint
      await prisma.file.update({
        where: { id: file.id },
        data: { url: `/api/files/serve/${file.id}` },
      });
      updated++;
      
      if (updated % 10 === 0) {
        console.log(`   Updated ${updated}/${files.length} files...`);
      }
    }

    console.log(`✅ Successfully updated ${updated} file URLs`);
  } catch (error) {
    console.error('❌ Error updating file URLs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateFileUrls()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
