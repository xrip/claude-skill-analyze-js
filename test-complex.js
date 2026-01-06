// Complex test file with various patterns
(function() {
  // Real endpoints (should be detected)
  const API_ENDPOINTS = {
    users: '/api/v2/users',
    posts: '/api/v2/posts',
    auth: '/oauth2/authorize',
    admin: '/admin/settings',
    graphql: '/graphql',
    wellKnown: '/.well-known/openid-configuration',
    upload: '/api/upload/files',
    debug: '/debug/info'
  };

  // External URLs (should be detected)
  const EXTERNAL_URLS = [
    'https://api.github.com/repos/user/project',
    'wss://realtime.example.com/notifications',
    'https://mybucket.s3.amazonaws.com/uploads/data.json',
    'https://storage.googleapis.com/my-project/config.yaml'
  ];

  // Secrets (should be detected and masked)
  const SECRETS = {
    aws: 'AKIAIOSFODNN7EXAMPLE',
    google: 'AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe',
    stripe: 'sk_live_51HzKp2eZvKYlo2C8h7DQJd9sK',
    github: 'ghp_1234567890abcdefghijklmnopqrstuvwx',
    slack: 'xoxb-1234567890-1234567890-abcdefghijklmnop',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    mongodb: 'mongodb://admin:password123@prod-db.example.com:27017/production',
    postgres: 'postgresql://user:pass@db.internal:5432/maindb'
  };

  // Email addresses (should be detected)
  const CONTACTS = [
    'admin@company.com',
    'support@example.io',
    'security@product.net'
  ];

  // Sensitive files (should be detected)
  const FILES = {
    env: '.env.production',
    config: 'database.config.yml',
    backup: 'db_backup_20240101.sql',
    cert: 'ssl/server.pem',
    key: 'ssl/private.key',
    archive: 'backups/full_backup.tar.gz',
    script: 'deploy.sh',
    data: 'exports/users_data.csv'
  };

  // NOISE - Should be filtered out
  import React from 'react';
  import { useState } from 'react';
  import '../utils/helpers.js';
  import './styles.css';

  const locale = 'en-US';
  const localeFile = 'locales/en.json';

  // Build artifacts
  const webpack = require('webpack');
  const polyfill = 'core-js/stable';

  // XML namespaces (noise)
  const xmlns = 'http://www.w3.org/2000/svg';
  const schema = 'http://schemas.openxmlformats.org/markup-compatibility/2006';

  // Test/placeholder (should be filtered)
  const testEmail = 'test@example.com';
  const testUrl = 'http://localhost:3000';
  const placeholderKey = 'XXXXXXXXXXXXXXXXXXXX';

  // Module paths (noise)
  const utilPath = './utils/format';
  const libPath = '../lib/database';
  const nodePath = './node_modules/package/index';

  // Static resources (noise)
  const css = 'styles/main.css';
  const image = 'images/logo.png';
  const font = 'fonts/roboto.woff2';

  // PDF internals (noise)
  const pdfType = '/Type /Font';
  const pdfObj = '12 0 R';

  // Short paths (noise)
  const shortPath = '/a';
  const singleLetter = '/P';
})();
