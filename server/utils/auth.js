const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhhhh';
const expiration = '8h';

module.exports = {
  authMiddleware: function({ req }) {
    /// --- allows token to be sent via req.body, req.query, or headers --- ///
    let token = req.body.token || req.query.token || req.headers.authorization;

    // -- ["Bearer", "<tokenvalue>"] -- //
    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim();
    }
    // if no token, return request object as is //
    if (!token) {
      return req;
    }

    try {
      // decode and attach user data to request object //
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch(error) {
      console.log('Invalid tokenn', error);
    }
    // return updated request object
    return req;
  },
 // expects a user object and adds user's username, email, and _id properties to token//
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};