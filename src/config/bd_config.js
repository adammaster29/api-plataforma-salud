require('dotenv').config();
const express = require('express');
const sql = require('mssql');

const config ={
server: process.env.DB_SERVER ,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_DATABASE,
options: {
  encrypt: true, // Use this if you're on Windows Azure
  trustServerCertificate: true // Change to true for local dev / self-signed certs
}
}
const poolpromise = async ()=>{

try {
    const pool = await sql.connect(config)
    console.log('Connected to the database');
    return pool  
} catch (error) {
    console.error('Database connection error:', error);
}

}

module.exports = {
    sql,
    poolpromise
}