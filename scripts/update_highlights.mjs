import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon("postgresql://neondb_owner:npg_6fmQKyBeTY7r@ep-bold-mouse-aeox7um2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require");

  const highlights = [
    { title: "New", isAdd: true },
    { title: "# college", image: "/instagram/hl_college.png" },
    { title: "💕", image: "/instagram/hl_love.png" },
    { title: "😉", image: "/instagram/hl_smile.png" },
    { title: "Real diamond 💎", image: "/instagram/hl_diamond.png" }
  ];

  await sql`
    UPDATE social_profiles
    SET 
      profile_pic = '/instagram/avatar.png',
      highlights = ${JSON.stringify(highlights)}
    WHERE id = 'instagram';
  `;

  console.log("Successfully updated highlights & avatar with local images in Neon DB!");
}

main().catch(console.error);
