import User from '../user/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await User.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Incorrect credentials, user not found ❌'
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                success: false,
                msg: 'User is inactive 🔒'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: 'Incorrect password 🔑❌'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            success: true,
            msg: 'Login successful ✅',
            userDetails: {
                uid: user.id,
                username: user.username,
                role: user.role,
                token: token,
            }
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            msg: 'Server error ⚠️',
            error: e.message
        });
    }
};

export const register = async (req, res) => {
    try {
        const { name, surname, username, email, password } = req.body;

        const encryptedPassword = await hash(password);

        const user = await User.create({
            name,
            surname,
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: 'CLIENT' // asignación explícita
        });

        return res.status(201).json({
            success: true,
            msg: 'User registered successfully 🎉',
            userDetails: {
                uid: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error registering user ❌',
            error: error.message
        });
    }
};
