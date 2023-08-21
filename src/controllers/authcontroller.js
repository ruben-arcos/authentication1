"use strict";

let db = require("../utils/db");
let argon2 = require("argon2"); // this is the pwd hash tool
let jwt = require("jsonwebtoken");
require("dotenv").config();

// AUTHENTICATION: ARE YOU WHO YOU SAY YOU ARE WHEN YOU LOG IN

/**
 * get the username, password, full_name from the body of the request
 * hash the password
 * insert the new record in the database
 * since the hash must finish first, we have to do an async/await to these steps
 *
 * request should look like this:
 *
 *  {
 *      "username": "rarcos",
 *      "password": "Bobisgreat!",
 *      "fullName": "Ruben Arcos"
 *   }
 *
 */

let register = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let fullName = req.body.fullName;

  // const { username, password, full_name } = req.body;

  let passwordHash;

  console.log(req.body)

  //password hash block
  try {
    passwordHash = await argon2.hash(password);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }

  let params = [username, passwordHash, fullName];
  let sql =
    `INSERT INTO regUsers (username, password_hash, full_name) VALUES(?, ?, ?)`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err, msg: "Something went wrong." });
    } else {
      console.log(results);
      res.json({ results, msgg: "User Created!" });
    }
  });

  // try {
  //   let results = await db.queryPromise(sql, params);
  //   // since I don't need to see any results, I don't need to use querySync
  //   res.sendStatus(200);
  // } catch (err) {
  //   console.log(err);
  //   if (err.code == "ER_DUP_ENTRY") {
  //     res.status(400).send("Username already exists");
  //   } else {
  //     res.sendStatus(500).send("Internal Server Error");
  //   }
  //   return; // stops execution of any more code in this function
  // }
};

/**
 * we have a registered user, and now they want to login
 * if they are good, here's your token, if not, I've got nothing for you
 * take in the username and password from the login form (req bosy)
 * find the user in the database and
 * we hash that password and compare it to the hash in the database
 * if the hashes match, it's a good password
 * so create a token for this user
 * sing the token - which means we're going to add salt (secret)
 * make the secret in my env file
 */

let login = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let sql =
    "select id, full_name, password_hash from regUsers where username = ?";
  let params = [username];

  db.query(sql, params, async (err, rows) => {
    if (err) {
      console.log("Could not find username", err);
      res.sendStatus(500);
    } else {
      // we found somebody, make sure it's just one row

      // ******** need to understand this better
      if (rows.length > 1) {
        console.log("Return too many rows for username", username);
        res.send(500);
      } else if (rows.length == 0) {
        console.log("username does not exists");
        res
          .send(400)
          .send("Username does not exist. Please sign up for an account");
      } else {
        // we have one good row
        // it comes back as an array with an object, so you have to get the row values by its index
        let pwdHash = rows[0].password_hash;
        let fullName = rows[0].full_name;
        let userId = rows[0].id;

        let goodPass = false;

        try {
          goodPass = await argon2.verify(pwdHash, password); // return a boolean, so if it's good here, then goodPass = true
        } catch (err) {
          console.log("Failed to verify passwor", err);
          res.status(400).send("Invalid password");
        }

        if (goodPass) {
          // make an unsigned token
          let token = {
            fullName: fullName,
            userId: userId,
          };

          // res.json(token) // unsigned token, so I'm just testing if this works so far

          //  now we need to sign the token
          let signedToken = jwt.sign(token, process.env.JWT_SECRET);

          //   show this just for testing
            res.json(signedToken);

          // send in real life (production)
          // res.sendStatus(200);
        } else {
          res.sendStatus(400);
        }
      }
    }
  });
};

module.exports = {
  register,
  login,
};
