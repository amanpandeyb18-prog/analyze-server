// Script to regenerate SAS URLs for existing files
import { prisma } from './src/lib/prisma';
import { generateBlobSasUrl } from './lib/azure-blob';

async function regenerateFileUrls() {
  console.log('🔄 Regenerating SAS URLs for existing files...');
  
  const files = await prisma.file.findMany({
    where: {
      key: {
        not: null
      }
    }
  });
  
  console.log(`Found ${files.length} files to update`);
  
  for (const file of files) {
    if (file.key) {
      try {
        const newUrl = generateBlobSasUrl(file.key, 525600); // 1 year
        await prisma.file.update({
          where: { id: file.id },
          data: { url: newUrl }
        });
        console.log(`✅ Updated: ${file.key}`);
      } catch (error) {
        console.error(`❌ Failed to update ${file.key}:`, error);
      }
    }
  }
  
  console.log('✅ Done!');
}

regenerateFileUrls()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
