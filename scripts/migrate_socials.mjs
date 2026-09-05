import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon("postgresql://neondb_owner:npg_6fmQKyBeTY7r@ep-bold-mouse-aeox7um2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require");
  
  await sql.query("ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS bio_lines JSONB;");
  await sql.query("ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS thought_bubble TEXT DEFAULT 'Make this space yours...';");
  await sql.query("ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Digital creator';");
  await sql.query("ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS threads_handle VARCHAR(100);");
  await sql.query("ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS empty_title VARCHAR(100) DEFAULT 'Create your first post';");
  await sql.query("ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS empty_subtitle VARCHAR(100) DEFAULT 'Make this space your own.';");
  
  const bioLines = [
    "❤️🚩jay shree Ram 🚩",
    "🤔A man without EGO , is not a man.",
    "⚠️ Currently busy turning my dreams into reality."
  ];

  await sql`
    UPDATE social_profiles
    SET 
      bio_lines = ${JSON.stringify(bioLines)},
      thought_bubble = 'Make this space yours...',
      category = 'Digital creator',
      threads_handle = 'jaydeep.prajapati_18',
      display_name = 'Er. Jaydeep Prajapati',
      username = 'jaydeep.prajapati_18',
      posts_count = '0',
      followers_count = '279',
      following_count = '258',
      views_30days = '762 views in the last 30 days.',
      music_track = 'Jannat B Praak',
      external_link = 'www.instagram.com/websetu.32?igsh=MTJwdXI3enBqd...'
    WHERE id = 'instagram';
  `;

  console.log("Successfully migrated and updated instagram row in Neon DB!");
}

main().catch(console.error);
