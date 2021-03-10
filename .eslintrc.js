module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node":true
    },
    "extends": "eslint:recommended",
    "globals":{
        "Atomics": "readonly",
        "ShareArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules":{
        "quotes":[
            "error",
            "single"
        ],
        "no-unused-vars": "off"
    }
};
