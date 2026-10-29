// backend/src/config/db.js
const mongoose = require('mongoose');
const dns = require('dns');

/**
 * Configure DNS resolution for MongoDB Atlas SRV connection strings.
 * On Windows or environments where the local/loopback DNS resolver (e.g., 127.0.0.1)
 * does not support SRV records, Node's internal c-ares resolver fails with querySrv ECONNREFUSED.
 * Using public DNS resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1) within the process scope
 * resolves this cleanly without changing global operating system network settings.
 */
const configureDns = () => {
  if (process.env.DNS_SERVERS) {
    const customServers = process.env.DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean);
    if (customServers.length > 0) {
      dns.setServers(customServers);
      return;
    }
  }

  const isSrv = process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb+srv://');
  if (isSrv) {
    try {
      const currentServers = dns.getServers();
      // If resolver is set to loopback (127.0.0.1) or running on Windows, use reliable public resolvers
      if (currentServers.includes('127.0.0.1') || currentServers.includes('::1') || process.platform === 'win32') {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      }
    } catch (e) {
      // Fallback silently if setServers fails
    }
  }
};

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not set. Backend running in disconnected/demo mode.');
    return;
  }

  configureDns();

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    // If it failed with a querySrv or ECONNREFUSED error, retry with explicit public DNS
    if (err.message && (err.message.includes('querySrv') || err.message.includes('ECONNREFUSED'))) {
      try {
        console.warn('⚠️ SRV DNS resolution failed. Retrying connection with public DNS (8.8.8.8, 1.1.1.1)...');
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully on DNS retry');
        return;
      } catch (retryErr) {
        console.error('❌ MongoDB connection retry error:', retryErr.message);
      }
    }
    console.error('❌ MongoDB connection error:', err.message);
    console.warn('⚠️ Server will continue running, but database operations will fail until MongoDB is accessible.');
  }
};

module.exports = connectDB;
