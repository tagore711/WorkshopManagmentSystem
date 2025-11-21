// Alternative export script with better error handling
const { Client } = require('pg');
const fs = require('fs');

const config = {
    user: 'ktm_user',
    password: 'Fo9LSV98atPCJ8zzIWocE3Eqbg2TFAMC',
    host: 'dpg-d3l8phndiees739cqkhg-a.singapore-postgres.render.com',
    database: 'ktmdb_pg',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000,
};

async function exportDatabase() {
    const client = new Client(config);

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected successfully!\n');

        // First, let's see what tables exist
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('📋 Found tables:', tablesResult.rows.map(r => r.table_name).join(', '));
        console.log('');

        const tables = tablesResult.rows.map(r => r.table_name);

        let sqlDump = `-- KTM Database Backup
-- Generated: ${new Date().toISOString()}
-- Database: ktmdb_pg
-- Host: dpg-d3l8phndiees739cqkhg-a.singapore-postgres.render.com

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

`;

        for (const table of tables) {
            console.log(`📦 Exporting table: ${table}`);

            try {
                const result = await client.query(`SELECT * FROM "${table}"`);
                console.log(`   ✓ Found ${result.rows.length} rows`);

                if (result.rows.length > 0) {
                    for (const row of result.rows) {
                        const columns = Object.keys(row).map(col => `"${col}"`).join(', ');
                        const values = Object.values(row).map(val => {
                            if (val === null) return 'NULL';
                            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                            if (val instanceof Date) return `'${val.toISOString()}'`;
                            return val;
                        }).join(', ');

                        sqlDump += `INSERT INTO "${table}" (${columns}) VALUES (${values});\n`;
                    }
                    sqlDump += '\n';
                }
            } catch (tableErr) {
                console.log(`   ⚠️  Error reading ${table}: ${tableErr.message}`);
            }
        }

        // Save to file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `ktm_backup_${timestamp}.sql`;
        fs.writeFileSync(filename, sqlDump);

        console.log(`\n✅ Export completed successfully!`);
        console.log(`📁 File: ${filename}`);
        console.log(`📊 Size: ${(fs.statSync(filename).size / 1024).toFixed(2)} KB`);
        console.log(`\n💾 Backup saved to: ${process.cwd()}\\${filename}`);

    } catch (err) {
        console.error('\n❌ Export failed!');
        console.error('Error:', err.message);
        console.error('\nPossible reasons:');
        console.error('- Database has already expired');
        console.error('- Connection timeout');
        console.error('- Network issues');
        console.error('\nTry accessing Render dashboard to check database status.');
    } finally {
        try {
            await client.end();
        } catch (e) {
            // Ignore close errors
        }
    }
}

exportDatabase();
