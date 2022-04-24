/*
 * mysql.js
 * Copyright (C) 2022 matthew <matthew@matthew-ubuntu>
 *
 * Distributed under terms of the MIT license.
 */
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost', 
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
