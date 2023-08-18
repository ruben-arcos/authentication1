/**
 * bob logs in with a username and password
 * and we have to figure out if it's really bob
 * 
 * we're going to store his creds in the database, so we have that info 
 * but we NEVER store the password
 * 
 * don't store the password, but if you enter a password, i can verify that it's correct
 * 
 * what we're going to store is a hashed(encrypted) password
 * 
 * hash is a recipe to do that
 */

// recipe: a-z and 0-9
// assign a number to char, so a-z --> 1-26, and 0-9 --> 27-36

// password
bob123 

2 
15
2
28
29
30

// add them up 2 + 15 + 2 + 28 + 29 + 30

106

// multiple that number by n times

45896312378 // this value is what i store

// we want one-way function, meaning it's easy to hash the password, but as hard as possible to un-hash

md5 // older

sha256 // newer and harder to crack

// the hashed pwd will be the same every time I enter the password

// we sometimes ise salt: random string that's added before the password and random number after the password

/**
 * register
 * user fills in username, password
 * we add the username to the database 
 * then we generate a pwd hash from the pwd they entered and stored the pwd hash (NOT the password)
 * 
 * login 
 * user logs in with username and pwd
 * we generate a pwd hash from the pwd they just entered
 * and check it against the hash in the database for that user
 * 
 * if they authenticate, then we 
 * create a token (we can put whatever we want in the token)
 * sign the token (confirmation thay it's authentic)
 * return signed token
 * 
 * when the user makes the next request, that request will include their signed token 
 * along with the route they're attempting to access
 * 
 * some routes are public (need no authorization) and some are private (need need auth)
 * it's our job to make sure they have a good signed token to access the private routes
 * 
 * signed token is their 'wristband' is valid 
 * 
 * so, before we let them access the private route, we have to check that token
 * to make sure it's valid
 */