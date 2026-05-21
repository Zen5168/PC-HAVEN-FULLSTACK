// Script to populate tech_services table
// Run with: node setup-tech-services.js

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const services = [
  {
    service_name: 'High-Fidelity Custom Build Assembly',
    description: 'Complete multi-component mounting, structural alignment, structural layout testing, and optimized BIOS parameters.',
    price: 4200.00,
    duration: '2 - 3 Hours',
    icon: 'bi-pc-display'
  },
  {
    service_name: 'Thermal Repasting & Micro-De-dusting',
    description: 'Deep hardware disinfection, removal of dry interfaces, and precision application of premium phase-change pads.',
    price: 2520.00,
    duration: '1 - 1.5 Hours',
    icon: 'bi-thermometer-half'
  },
  {
    service_name: 'Critical OS & Driver Diagnostics Suite',
    description: 'Secure operating system fresh payload deployment, absolute latency isolation tracking, and driver configuration mapping.',
    price: 2240.00,
    duration: '1 Hour',
    icon: 'bi-hdd-network'
  }
];

async function setupTechServices() {
  const client = await pool.connect();
  
  try {
    console.log('Connecting to database...');
    
    // Check if services already exist
    const checkResult = await client.query('SELECT COUNT(*) FROM tech_services');
    const count = parseInt(checkResult.rows[0].count);
    
    if (count > 0) {
      console.log(`Found ${count} existing services in the database.`);
      console.log('Displaying current services:');
      
      const existingServices = await client.query(
        'SELECT id, service_name, price, duration, is_active FROM tech_services ORDER BY id'
      );
      
      console.table(existingServices.rows);
      console.log('\nTo add new services, insert them manually or clear the table first.');
      return;
    }
    
    console.log('No services found. Inserting default services...');
    
    // Insert services
    for (const service of services) {
      await client.query(
        `INSERT INTO tech_services (service_name, description, price, duration, icon, is_active)
         VALUES ($1, $2, $3, $4, $5, TRUE)`,
        [service.service_name, service.description, service.price, service.duration, service.icon]
      );
      console.log(`✓ Inserted: ${service.service_name}`);
    }
    
    console.log('\n✅ All services inserted successfully!');
    
    // Display inserted services
    const result = await client.query(
      'SELECT id, service_name, price, duration, is_active FROM tech_services ORDER BY id'
    );
    
    console.log('\nCurrent services in database:');
    console.table(result.rows);
    
  } catch (error) {
    console.error('❌ Error setting up tech services:', error.message);
    console.error('Full error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

setupTechServices();
