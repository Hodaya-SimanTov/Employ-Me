
var expect = require('chai').expect;
var {checkName}=require('../views/sign_up.js');

describe('Name', () => {
    describe('#name not null', () => {
         it('afghklkl', () => {
            expect(checkName(2,3)).toBe(5);
        })       
    })    
})