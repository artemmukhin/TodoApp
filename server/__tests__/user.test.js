const mongoose = require('mongoose');
const User = require('../models/user');

describe('User Model Test', () => {
    it('should create & save user successfully', async () => {
        const userData = {
            username: 'testuser',
            password: 'testpassword'
        };
        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(userData.username);
        expect(savedUser.password).not.toBe(userData.password);
    });

    it('should fail to create user without required fields', async () => {
        const user = new User({});
        let err;
        try {
            await user.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.username).toBeDefined();
        expect(err.errors.password).toBeDefined();
    });

    it('should compare password correctly', async () => {
        const userData = {
            username: 'testuser2',
            password: 'testpassword'
        };
        const user = new User(userData);
        await user.save();

        const isMatch = await user.comparePassword('testpassword');
        expect(isMatch).toBe(true);

        const isNotMatch = await user.comparePassword('wrongpassword');
        expect(isNotMatch).toBe(false);
    });
});