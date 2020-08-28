module.exports = {
  "env": {
    "commonjs": true,
    "es2020": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 11
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "warning",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
