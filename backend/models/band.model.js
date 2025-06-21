/**
 * Band Model
 * Defines the schema for bands in the application
 */
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Band:
 *       type: object
 *       required:
 *         - name
 *         - createdBy
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the band
 *         name:
 *           type: string
 *           description: Name of the band
 *         description:
 *           type: string
 *           description: Description of the band
 *         members:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user who is a member
 *               role:
 *                 type: string
 *                 enum: [leader, member]
 *                 description: Role of the user in the band
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [edit_setlists, add_songs, edit_songs, invite_members, remove_members]
 *                 description: Permissions granted to this member
 *         createdBy:
 *           type: string
 *           description: ID of the user who created the band
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the band was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the band was last updated
 */
const bandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Band name is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      required: true
    },
    permissions: [{
      type: String,
      enum: ['edit_setlists', 'add_songs', 'edit_songs', 'invite_members', 'remove_members'],
      default: ['edit_setlists', 'add_songs']
    }]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  }
}, { timestamps: true });

// Indexes for better query performance
bandSchema.index({ 'members.userId': 1 });
bandSchema.index({ createdBy: 1 });
bandSchema.index({ name: 'text', description: 'text' });

// Pre-save hook to ensure creator is also a member and leader
bandSchema.pre('save', function(next) {
  // If this is a new band (creation)
  if (this.isNew) {
    // Check if creator is already in members array
    const creatorMember = this.members.find(
      member => member.userId.toString() === this.createdBy.toString()
    );
    
    // If not, add the creator as a leader with all permissions
    if (!creatorMember) {
      this.members.push({
        userId: this.createdBy,
        role: 'leader',
        permissions: [
          'edit_setlists', 
          'add_songs', 
          'edit_songs', 
          'invite_members', 
          'remove_members'
        ]
      });
    }
  }
  
  next();
});

// Method to check if a user is a member of the band
bandSchema.methods.hasMember = function(userId) {
  return this.members.some(member => member.userId.toString() === userId.toString());
};

// Method to check if a user is a leader of the band
bandSchema.methods.isLeader = function(userId) {
  const member = this.members.find(member => member.userId.toString() === userId.toString());
  return member && member.role === 'leader';
};

// Method to check if a user has a specific permission
bandSchema.methods.hasPermission = function(userId, permission) {
  const member = this.members.find(member => member.userId.toString() === userId.toString());
  
  if (!member) return false;
  
  // Leaders automatically have all permissions
  if (member.role === 'leader') return true;
  
  // Check for specific permission
  return member.permissions.includes(permission);
};

const Band = mongoose.model('Band', bandSchema);

module.exports = Band;