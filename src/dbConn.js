const express = require('express');
const postgres = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
var dateFormat = require('dateformat');

const app = express();
app.set("port", process.env.PORT || 3001);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = require('pg').Pool;
const db = new pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false
});

const pool = new Pool(config);
const conn = await db.connect();

if (conn) {
    console.log('Database connection established');
} else {
    console.error('Failed to connect to the database');
}


