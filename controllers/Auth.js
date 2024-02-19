const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });

    if (user) {
      if (user.emailVerified) {
        return res.json({ success: false, message: "Email already in use" });
      } else {
        // User exists but email is not verified yet
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) {
            return res.json({ success: false, message: err.message });
          }
          user.name = name;
          user.password = hash;
          await user.save();

          const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.user,
              pass: process.env.pass,
            },
          });

          const mailOptions = {
            to: user.email,
            from: process.env.user,
            subject: "Activate Your Cars World Account",
            html: `<p> Hey ${user.name}, Welcome To. Cars World <br/> Your Account has been created. In order to use your account you have to verify your email by clicking on following link </p>
                                <a style="padding:10px; background-color: dodgerblue" href="${process.env.BACKEND_URL}/auth/activate-account/${token}"> Activate Account </a>
                                `,
          };

          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              return res.json({
                success: false,
                message: "Error While Sending Email",
              });
            } else {
              return res.json({
                success: true,
                message:
                  "An invitation link has been sent on your email to activate account",
              });
            }
          });
        });
      }
    } else {
      // User does not exist, create a new one
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.json({ success: false, message: err.message });
        }
        user = await User.create({ name: name, email: email, password: hash });

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.user,
            pass: process.env.pass,
          },
        });

        const mailOptions = {
          to: user.email,
          from: process.env.user,
          subject: "Activate Your Cars World Account",
          html: `<p> Hey ${user.name}, Welcome To. Cars World <br/> Your Account has been created. In order to use your account you have to verify your email by clicking on following link </p>
                              <a style="padding:10px; background-color: dodgerblue" href="${process.env.BACKEND_URL}/auth/activate-account/${token}"> Activate Account </a>
                              `,
        };

        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            return res.json({
              success: false,
              message: "Error While Sending Email",
            });
          } else {
            return res.json({
              success: true,
              message:
                "An invitation link has been sent on your email to activate account",
            });
          }
        });
      });
    }
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "Email not found" });
    }
    if (!user.emailVerified) {
      return res.json({
        success: false,
        message: "Please Verify Your Account by the link sent on mail",
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result == true) {
        const token = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            balance: user.balance,
          },
          process.env.TOKEN_SECRET
        );

        return res.json({
          success: true,
          message: "Logged in successful",
          token: token,
          name: user.name,
          balance: user.balance,
          role: user.role, 
        });
      } else {
        return res.json({ success: false, message: "Wrong Password" });
      }
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};



const activateAccount = async (req, res) => {
  const token = req.params.token;

  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);

    await User.findByIdAndUpdate(data._id, {
      emailVerified: true,
    });

    return res.redirect("https://localhost:5173/");
  } catch (err) {
    return res.json({ success: false, message: "Link has Been Expired!" });
  }
};

module.exports = { signUp, login, activateAccount };
