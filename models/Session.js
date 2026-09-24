const mongoose = require("mongoose")

// Defines the structure of a user session document.
const sessionSchema = new mongoose.Schema(
  {
    // Unique identifier for the session.
    sessionId: {
      type: String,
      required: true,
      unique: true
    },

    // Reference to the user who owns this session.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Session expiration time. MongoDB removes the document after this time.
    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    // Automatically adds createdAt and updatedAt fields.
    timestamps: true
  }
)

// TTL index: automatically deletes sessions when expiresAt is reached.
sessionSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0
  }
)

// Creates and exports the Session model.
const Session = mongoose.model("Session", sessionSchema)

module.exports = Session