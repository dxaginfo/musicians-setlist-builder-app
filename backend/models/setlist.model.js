/**
 * Setlist Model
 * Defines the schema for setlists in the application
 */
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Setlist:
 *       type: object
 *       required:
 *         - title
 *         - createdBy
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the setlist
 *         title:
 *           type: string
 *           description: Title of the setlist
 *         description:
 *           type: string
 *           description: Description of the setlist
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time of the performance
 *         venue:
 *           type: string
 *           description: Venue where the performance will take place
 *         totalDuration:
 *           type: number
 *           description: Total duration of the setlist in seconds
 *         sets:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the set (e.g., "First Set", "Acoustic Set")
 *               duration:
 *                 type: number
 *                 description: Duration of the set in seconds
 *               songs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     songId:
 *                       type: string
 *                       description: ID of the song
 *                     order:
 *                       type: number
 *                       description: Position of the song in the set
 *                     duration:
 *                       type: number
 *                       description: Duration of the song in seconds (may differ from original)
 *                     notes:
 *                       type: string
 *                       description: Performance notes specific to this song in the setlist
 *                     isPlayed:
 *                       type: boolean
 *                       description: Whether the song has been played in a performance
 *         createdBy:
 *           type: string
 *           description: ID of the user who created the setlist
 *         bandId:
 *           type: string
 *           description: ID of the band associated with the setlist (if any)
 *         isPublic:
 *           type: boolean
 *           description: Whether the setlist is publicly viewable
 *         version:
 *           type: number
 *           description: Current version number of the setlist
 *         versionHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               version:
 *                 type: number
 *                 description: Version number
 *               changedBy:
 *                 type: string
 *                 description: ID of the user who made the change
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: When the change was made
 *               changes:
 *                 type: string
 *                 description: Description of changes made
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the setlist was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the setlist was last updated
 */
const setlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  date: {
    type: Date,
    default: null
  },
  venue: {
    type: String,
    default: '',
    trim: true
  },
  totalDuration: {
    type: Number, // in seconds
    default: 0
  },
  sets: [{
    name: {
      type: String,
      default: 'Main Set',
      trim: true
    },
    duration: {
      type: Number, // in seconds
      default: 0
    },
    songs: [{
      songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
      },
      order: {
        type: Number,
        required: true
      },
      duration: {
        type: Number, // in seconds
        default: 0
      },
      notes: {
        type: String,
        default: ''
      },
      isPlayed: {
        type: Boolean,
        default: false
      }
    }]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  bandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band',
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  versionHistory: [{
    version: Number,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    changes: String
  }]
}, { timestamps: true });

// Create indexes for better query performance
setlistSchema.index({ createdBy: 1 });
setlistSchema.index({ bandId: 1 });
setlistSchema.index({ title: 'text', description: 'text', venue: 'text' });
setlistSchema.index({ date: 1 });
setlistSchema.index({ isPublic: 1 });

// Pre-save hook to update total duration
setlistSchema.pre('save', function(next) {
  // Calculate total duration from all sets
  this.totalDuration = this.sets.reduce((total, set) => {
    // Calculate set duration from all songs
    set.duration = set.songs.reduce((setTotal, song) => setTotal + (song.duration || 0), 0);
    return total + set.duration;
  }, 0);
  
  next();
});

// Virtual for formatted total duration (HH:MM:SS)
setlistSchema.virtual('formattedTotalDuration').get(function() {
  if (!this.totalDuration) return '00:00:00';
  
  const hours = Math.floor(this.totalDuration / 3600);
  const minutes = Math.floor((this.totalDuration % 3600) / 60);
  const seconds = this.totalDuration % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Method to check if user has access to this setlist
setlistSchema.methods.isAccessibleBy = async function(userId) {
  // Public setlists are accessible by anyone
  if (this.isPublic) {
    return true;
  }
  
  // Creator always has access
  if (this.createdBy.toString() === userId.toString()) {
    return true;
  }
  
  // If setlist belongs to a band, check if user is in that band
  if (this.bandId) {
    const Band = mongoose.model('Band');
    const band = await Band.findOne({
      _id: this.bandId,
      'members.userId': userId
    });
    
    return !!band;
  }
  
  return false;
};

// Method to add a song to a set
setlistSchema.methods.addSong = function(setIndex, songId, duration, notes = '') {
  // Create set if it doesn't exist
  if (!this.sets[setIndex]) {
    this.sets[setIndex] = {
      name: `Set ${setIndex + 1}`,
      songs: []
    };
  }
  
  // Determine next order number
  const nextOrder = this.sets[setIndex].songs.length 
    ? Math.max(...this.sets[setIndex].songs.map(s => s.order)) + 1 
    : 1;
  
  // Add the song
  this.sets[setIndex].songs.push({
    songId,
    order: nextOrder,
    duration,
    notes
  });
  
  return this;
};

// Method to move a song within a set or to another set
setlistSchema.methods.moveSong = function(fromSetIndex, fromSongIndex, toSetIndex, toPosition) {
  // Validate indexes
  if (!this.sets[fromSetIndex] || !this.sets[toSetIndex]) {
    throw new Error('Invalid set index');
  }
  
  if (!this.sets[fromSetIndex].songs[fromSongIndex]) {
    throw new Error('Invalid song index');
  }
  
  // Remove the song from its current position
  const song = this.sets[fromSetIndex].songs.splice(fromSongIndex, 1)[0];
  
  // Add the song to its new position
  this.sets[toSetIndex].songs.splice(toPosition, 0, song);
  
  // Reorder songs in the destination set
  this.sets[toSetIndex].songs.forEach((song, index) => {
    song.order = index + 1;
  });
  
  // If source and destination sets are different, reorder the source set too
  if (fromSetIndex !== toSetIndex) {
    this.sets[fromSetIndex].songs.forEach((song, index) => {
      song.order = index + 1;
    });
  }
  
  return this;
};

const Setlist = mongoose.model('Setlist', setlistSchema);

module.exports = Setlist;