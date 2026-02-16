// models/examplan.js
const mongoose = require('mongoose');

const examplanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  exam: { type: String, required: true },
  stream: { type: String, required: true },
  preparationType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  vacationStart: { type: Date },
  vacationEnd: { type: Date },
  hasRevision: { type: Boolean, default: false },
  hasVacation: { type: Boolean, default: false },

  // Enhanced schedule data with new types
  schedule: [{
    date: Date,
    subject: String,
    topic: String,
    type: { 
      type: String, 
      enum: ['study', 'Rev1', 'Rev2', 'vacation', 'backup', 'test'],
      default: 'study'
    },
    testType: { 
      type: String, 
      enum: ['topic', 'full_length_rev1', 'full_length_rev2'],
      required: function() { return this.type === 'test'; }
    },
    color: String,
    isLastDay: { type: Boolean, default: false }
  }],

  // Enhanced statistics
  statistics: {
    totalDays: Number,
    studyDays: Number,
    vacationDays: Number,
    mainCourseDays: Number,
    revision1Days: Number,
    revision2Days: Number,
    finalRevision1Days: Number,
    finalRevision2Days: Number,
    backupDays: Number,
    
    // Schedule breakdown
    scheduleBreakdown: {
      totalDays: Number,
      studyDays: Number,
      revision1Days: Number,
      revision2Days: Number,
      vacationDays: Number,
      backupDays: Number,
      testDays: Number,
      topicTests: Number,
      fullLengthRev1Tests: Number,
      fullLengthRev2Tests: Number
    },

    // Subject-wise statistics
    subjectStats: [{
      name: String,
      studyDays: Number,
      revision1Days: Number,
      revision2Days: Number,
      totalDays: Number,
      topicCount: Number,
      expectedTopicTests: Number
    }]
  },

  // Phase boundaries
  phases: {
    z1: Number, // End of main course
    z2: Number, // End of revision 1
    z3: Number  // End of revision 2
  },

  subjects: [{
    name: String,
    studyDays: Number,
    revision1Days: Number,
    revision2Days: Number,
    totalDays: Number,
    color: String,
    topics: [{
      name: String,
      days: Number,
      weight: Number
    }]
  }],

  calendarImages: [{
    month: String,
    imageUrl: String
  }],

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes
examplanSchema.index({ userId: 1, isActive: 1 });
examplanSchema.index({ exam: 1, stream: 1, preparationType: 1 });
examplanSchema.index({ userId: 1, exam: 1, stream: 1, preparationType: 1 });
examplanSchema.index({ 'schedule.date': 1 });
examplanSchema.index({ 'schedule.type': 1 });

module.exports = mongoose.model('Examplan', examplanSchema);
