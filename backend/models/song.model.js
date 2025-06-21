/**
 * Song Model
 * Defines the schema for songs in the application
 */
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       required:
 *         - title
 *         - createdBy
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the song
 *         title:
 *           type: string
 *           description: Title of the song
 *         artist:
 *           type: string
 *           description: Artist/performer of the song
 *         duration:
 *           type: number
 *           description: Duration of the song in seconds
 *         key:
 *           type: string
 *           description: Musical key of the song (e.g., C, A minor)
 *         tempo:
 *           type: number
 *           description: Tempo of the song in BPM
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags for categorizing the song
 *         notes:
 *           type: string
 *           description: Any additional notes about the song
 *         chordSheetUrl:
 *           type: string
 *           description: URL to the chord sheet file
 *         lyricsUrl:
 *           type: string
 *           description: URL to the lyrics file
 *         spotifyId:
 *           type: string
 *           description: Spotify track ID for reference
 *         createdBy:
 *           type: string
 *           description: ID of the user who created the song
 *         bandId:
 *           type: string
 *           description: ID of the band associated with the song (if any)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the song was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the song was last updated
 */
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  artist: {
    type: String,
    trim: true,
    default: ''
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  key: {
    type: String,
    trim: true,
    default: ''
  },
  tempo: {
    type: Number, // in BPM
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    default: ''
  },
  chordSheetUrl: {
    type: String,
    default: ''
  },
  lyricsUrl: {
    type: String,
    default: ''
  },
  spotifyId: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  bandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band',
    default: null
  }
}, { timestamps: true });

// Create indexes for better search performance
songSchema.index({ title: 'text', artist: 'text', tags: 'text' });
songSchema.index({ createdBy: 1 });
songSchema.index({ bandId: 1 });

// Virtual for formatted duration (MM:SS)
songSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return '00:00';
  
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Method to check if user has access to this song
songSchema.methods.isAccessibleBy = async function(userId) {
  // Creator always has access
  if (this.createdBy.toString() === userId.toString()) {
    return true;
  }
  
  // If song belongs to a band, check if user is in that band
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

const Song = mongoose.model('Song', songSchema);

module.exports = Song;