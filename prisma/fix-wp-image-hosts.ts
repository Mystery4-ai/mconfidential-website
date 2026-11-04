/**
 * One-off: repoint Image.url rows that hotlink the old WordPress media
 * library from mconfidential.ma (now this Vercel deployment, no longer
 * serving those files) to confidentiel.ma (sister domain still pointing
 * at the original host, confirmed serving the same files with 200s).
 * Run with: npx tsx prisma/fix-wp-image-hosts.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const images = await db.image.findMany({
    where: { url: { contains: "mconfidential.ma/wp-content" } },
    select: { id: true, url: true },
  });

  console.log(`Found ${images.length} images to repoint.`);

  let updated = 0;
  for (const img of images) {
    const newUrl = img.url.replace("mconfidential.ma", "confidentiel.ma");
    await db.image.update({ where: { id: img.id }, data: { url: newUrl } });
    updated += 1;
  }

  console.log(`Updated ${updated} image URLs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
