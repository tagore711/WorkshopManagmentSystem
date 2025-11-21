// Import Database Schema to Supabase
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionConfig = {
    user: 'postgres',
    password: '2vfH8NErpLVrduyI',
    host: 'db.hqlavmhxafrfxbfirjpd.supabase.co',
    database: 'postgres',
    port: 5432,
    ssl: { rejectUnauthorized: false }
};

async function importSchema() {
    const client = new Client(connectionConfig);

    try {
        console.log('🔌 Connecting to Supabase database...');
        await client.connect();
        console.log('✅ Connected successfully!\n');

        // Read the SQL schema file
        const schemaPath = path.join(__dirname, 'pgadmin.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        console.log('📂 Reading pgadmin.sql schema file...');
        console.log('📏 Schema size:', (schemaSQL.length / 1024).toFixed(2), 'KB\n');

        console.log('🚀 Importing schema to Supabase...');
        console.log('This may take a few seconds...\n');

        // Execute the entire schema
        await client.query(schemaSQL);

        console.log('✅ Schema imported successfully!');
        console.log('\n📊 Verifying tables created...');

        // Verify tables exist
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('\n📋 Tables created:');
        tablesResult.rows.forEach(row => {
            console.log('   ✓', row.table_name);
        });

        // Verify triggers exist
        const triggersResult = await client.query(`
            SELECT trigger_name, event_object_table 
            FROM information_schema.triggers 
            WHERE trigger_schema = 'public'
            ORDER BY trigger_name
        `);

        console.log('\n⚡ Triggers created:');
        triggersResult.rows.forEach(row => {
            console.log('   ✓', row.trigger_name, 'on', row.event_object_table);
        });

        console.log('\n🎉 Database setup complete!');
        console.log('✅ Your Supabase database is ready to use.');

    } catch (err) {
        console.error('\n❌ Import failed!');
        console.error('Error:', err.message);
        console.error('\nDetails:', err.stack);
    } finally {
        await client.end();
        console.log('\n🔌 Disconnected from database.');
    }
}

importSchema();
