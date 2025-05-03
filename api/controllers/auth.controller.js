import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === '' || email === '' || password === '') {
    next(errorHandler(400, 'All fileds are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json('signup successful');
  } catch (error) {
    next(error)
  }


};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, 'All fileds are required'))
  };

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    };

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'))
    };

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_Secret
    );

    // this is destructuring technique to hide the password;

    const { password: pass, ...rest } = validUser._doc;

    // this is another way to hide the password 

    // const rest = Object.assign({}, validUser._doc);
    // delete rest.password;


    res.status(200).cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    }).json(rest);

  } catch (error) {
    next(error)
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_Secret
      );
      const { password, ...rest } = user._doc;
      const isProduction = process.env.NODE_ENV === 'production';

      res.status(200).cookie('access_token', token, {
        httpOnly: true,
        secure: isProduction, // only true in production (https)
        sameSite: isProduction ? 'None' : 'Lax',
      }).json(rest)
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      })
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_Secret);
      const { password, ...rest } = newUser._doc;
      const isProduction = process.env.NODE_ENV === 'production';

      res.status(200).cookie('access_token', token, {
        httpOnly: true,
        secure: isProduction, // only true in production (https)
        sameSite: isProduction ? 'None' : 'Lax',
      }).json(rest);
    }
  } catch (error) {
    next(error)
  }

}