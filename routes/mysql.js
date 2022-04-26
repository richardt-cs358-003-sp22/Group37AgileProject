/*
 * mysql.js
 * Copyright (C) 2022 matthew <matthew@matthew-ubuntu>
 *
 * Distributed under terms of the MIT license.
 */
const mariadb = require('mariadb');
const crypto = require('crypto');
const pool = mariadb.createPool({
  host: '127.0.0.1', 
  user:'express',
  database: 'time_share',
  password: '',
  connectionLimit: 10,
});

//async function asyncFunction() {
  //let conn;
  //try {
    //conn = await pool.getConnection();
    //const rows = await conn.query("SELECT 1 as val");
    //console.log(rows); //[ {val: 1}, meta: ... ]
    //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
    //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  //} catch (err) {
    //throw err;
  //} finally {
    //if (conn) return conn.end();
  //}
//}

exports.query = async function(sql, params) {
  try {
    let conn = await pool.getConnection();
    return await conn.query(sql, params);
  } catch(err) {
    throw err;
  }
};

// CREATE TABLE users (email VARCHAR(255), salt BINARY(16), password BINARY(64), legal_name VARCHAR(255), PRIMARY KEY(email));

exports.add_user = async function(email, password, legal_name) {
  try {
    let conn = await pool.getConnection();
    const salt = crypto.randomBytes(16);
    await conn.query("INSERT INTO users (email, salt, password, legal_name) VALUES (?, ?, SHA2(CONCAT(?, ?), 256), ?)", [email, salt, salt, password, legal_name]);
    return { email: email, legal_name: legal_name };
  } catch(e) {
    if(e.code == 'ER_DUP_ENTRY') {
      throw {
        code: 400,
        error: 'Email already in use',
      };
    } else {
      console.log(e);
      throw {
        code: 500,
        error: 'Internal Server Error',
      };
    }
  }
};

exports.get_user = async function(email, password) {
  let rows;
  try {
    let conn = await pool.getConnection();
    rows = await conn.query("SELECT legal_name FROM users WHERE email = ? AND SHA2(CONCAT(salt, ?), 256) = password", [email, password]);
  } catch(e) {
    console.log(e);
    throw {
      code: 500,
      error: 'Internal Server Error',
    };
  }
  if(rows.length == 1) {
    return { email: email, legal_name: rows[0].legal_name };
  } else {
    throw {
      code: 400,
      error: 'Email or Password incorrect',
    };
  }
};
