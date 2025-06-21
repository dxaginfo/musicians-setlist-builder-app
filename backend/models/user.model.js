/**
 * User Model
 * Defines the schema for users in the application
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         email:
 *           type: string
 *           description: User's email address (unique)
 *         password:
 *           type: string
 *           description: User's password (hashed)
 *         name:
 *           type: string
 *           description: User's full name
 *         profilePicture:
 *           type: string
 *           description: URL to user's profile picture
 *         settings:
 *           type: object
 *           properties:
 *             defaultSetDuration:
 *               type: number
 *               description: Default duration for sets in minutes
 *             theme:
 *               type: string
 *               enum: [light, dark, auto]
 *               description: User's preferred theme
 *             notifications:
 *               type: boolean
 *               description: Whether the user wants to receive notifications
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the user was last updated
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  profilePicture: {
    type: String,
    default: 'https://setlist-builder.s3.amazonaws.com/defaults/default-profile.png'
  },
  settings: {
    defaultSetDuration: {
      type: Number,
      default: 45 // in minutes
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password is correct
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user profile (without sensitive information)
userSchema.methods.getProfile = function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    profilePicture: this.profilePicture,
    settings: this.settings,
    createdAt: this.createdAt
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;