/**
 * Seed Admin User Script
 *
 * Usage: node scripts/seed-admin.js <email> <password> <name>
 *
 * This generates the SQL to insert a super_admin user.
 * Copy the output and run it against D1.
 */

const crypto = require('crypto');

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);

      const combined = Buffer.concat([salt, derivedKey]);
      resolve(combined.toString('base64'));
    });
  });
}

function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

async function main() {
  const email = process.argv[2] || 'admin@killingtongetaway.com';
  const password = process.argv[3] || 'changeme123';
  const name = process.argv[4] || 'Admin';

  console.log('\n=== Killington CMS Admin Seeder ===\n');
  console.log(`Email: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`Password: ${password}\n`);

  const id = generateId();
  const passwordHash = await hashPassword(password);

  const sql = `INSERT INTO users (id, email, password_hash, role, name, is_active) VALUES ('${id}', '${email.toLowerCase()}', '${passwordHash}', 'super_admin', '${name}', 1);`;

  console.log('Run this SQL command:\n');
  console.log('---');
  console.log(sql);
  console.log('---\n');

  console.log('Wrangler command:');
  console.log(`CLOUDFLARE_ACCOUNT_ID=97cc536d643fd08e5a8dcb35839a8cfd npx wrangler d1 execute killington-cms --remote --command="${sql}"`);
  console.log('\n');
}

main().catch(console.error);
