// controllers/examplan.js
const Exam = require('../models/exam');
const Examplan = require('../models/examplan');
const User = require('../models/user');
const ExamPlanService = require('../helpers/examplan');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Get all exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true }).select('name slug description streams');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};

// Get exam by slug
exports.getExam = async (req, res) => {
  try {
    const { examSlug } = req.params;
    const exam = await Exam.findOne({ slug: examSlug, isActive: true });
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};

// Get stream by slug
exports.getStream = async (req, res) => {
  try {
    const { examSlug, streamSlug } = req.params;
    
    const exam = await Exam.findOne({ slug: examSlug, isActive: true });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    const stream = exam.streams.find(s => s.slug === streamSlug && s.isActive);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    
    res.json({ 
      exam: exam.name, 
      examSlug: exam.slug, 
      stream: {
        name: stream.name,
        slug: stream.slug,
        preparationTypes: stream.preparationTypes.filter(pt => pt.isActive)
      }
    });
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};

// Get preparation types for a stream
exports.getPreparationTypes = async (req, res) => {
  try {
    const { examSlug, streamSlug } = req.params;
    
    const exam = await Exam.findOne({ slug: examSlug, isActive: true });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    const stream = exam.streams.find(s => s.slug === streamSlug && s.isActive);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    
    res.json({
      exam: exam.name,
      examSlug: exam.slug,
      stream: stream.name,
      streamSlug: stream.slug,
      preparationTypes: stream.preparationTypes.filter(pt => pt.isActive)
    });
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};

// Get specific preparation type
exports.getPreparationType = async (req, res) => {
  try {
    const { examSlug, streamSlug, prepTypeSlug } = req.params;
    
    const exam = await Exam.findOne({ slug: examSlug, isActive: true });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    const stream = exam.streams.find(s => s.slug === streamSlug && s.isActive);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    
    const preparationType = stream.preparationTypes.find(pt => pt.slug === prepTypeSlug && pt.isActive);
    if (!preparationType) {
      return res.status(404).json({ error: 'Preparation type not found' });
    }
    
    res.json({
      exam: exam.name,
      examSlug: exam.slug,
      stream: stream.name,
      streamSlug: stream.slug,
      preparationType
    });
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};

// Generate exam plan (supports both with and without preparation types)
// Enhanced generateExamPlan function
exports.generateExamPlan = async (req, res) => {
  try {
    const { examSlug, streamSlug, prepTypeSlug } = req.params;
    const { startDate, endDate, vacationStart, vacationEnd, hasRevision, hasVacation } = req.body;
    
    // Input validation
    const dateValidation = ExamPlanService.validateDates(startDate, endDate, vacationStart, vacationEnd);
    if (!dateValidation.isValid) {
      return res.status(400).json({ error: dateValidation.error });
    }
    
    // Get exam and stream
    const exam = await Exam.findOne({ slug: examSlug, isActive: true });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    const stream = exam.streams.find(s => s.slug === streamSlug && s.isActive);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    
    let subjects;
    let preparationTypeName = 'Default';
    
    if (prepTypeSlug) {
      const preparationType = stream.preparationTypes.find(pt => pt.slug === prepTypeSlug && pt.isActive);
      if (!preparationType) {
        return res.status(404).json({ error: 'Preparation type not found' });
      }
      subjects = preparationType.subjects;
      preparationTypeName = preparationType.name;
    } else {
      if (stream.preparationTypes && stream.preparationTypes.length > 0) {
        const defaultPrepType = stream.preparationTypes.find(pt => pt.isActive) || stream.preparationTypes[0];
        subjects = defaultPrepType.subjects;
        preparationTypeName = defaultPrepType.name;
      } else {
        subjects = stream.subjects || [];
      }
    }
    
    // Calculate study distribution and phases
    const studyDistribution = ExamPlanService.calculateStudyDays({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      vacationStart: vacationStart ? new Date(vacationStart) : null,
      vacationEnd: vacationEnd ? new Date(vacationEnd) : null,
      hasVacation
    });
    
    // Calculate study phases for enhanced scheduling
    const studyPhases = ExamPlanService.calculateStudyPhases(studyDistribution.effectiveStudyDays);
    
    // Calculate vacation phases for proper phase detection
    const vacationPhases = ExamPlanService.calculateVacationPhases({
      startDate: new Date(startDate),
      vacationStart: vacationStart ? new Date(vacationStart) : null,
      vacationEnd: vacationEnd ? new Date(vacationEnd) : null,
      hasVacation,
      mainCourseDays: studyPhases.mainCourseDays,
      finalRevision1Days: studyPhases.finalRevision1Days,
      finalRevision2Days: studyPhases.finalRevision2Days,
      totalVacationDays: studyDistribution.vacationDays
    });
    
    // Distribute days across subjects
    const subjectDistribution = ExamPlanService.distributeSubjectDays(
      subjects,
      studyPhases,
      hasRevision
    );
    
    // Generate enhanced daily schedule with backup days, revision types, and tests
    const dailySchedule = ExamPlanService.generateDailySchedule({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      vacationStart: vacationStart ? new Date(vacationStart) : null,
      vacationEnd: vacationEnd ? new Date(vacationEnd) : null,
      subjectDistribution,
      hasVacation,
      studyPhases: { ...studyPhases, ...vacationPhases }
    });
    
    // Calculate enhanced statistics
    const scheduleStats = dailySchedule.reduce((acc, day) => {
      acc.totalDays++;
      if (day.type === 'study') acc.studyDays++;
      if (day.type === 'Rev1') acc.revision1Days++;
      if (day.type === 'Rev2') acc.revision2Days++;
      if (day.type === 'vacation') acc.vacationDays++;
      if (day.type === 'backup') acc.backupDays++;
      if (day.type === 'test') {
        acc.testDays++;
        if (day.testType === 'topic') acc.topicTests++;
        if (day.testType === 'full_length_rev1') acc.fullLengthRev1Tests++;
        if (day.testType === 'full_length_rev2') acc.fullLengthRev2Tests++;
      }
      return acc;
    }, {
      totalDays: 0,
      studyDays: 0,
      revision1Days: 0,
      revision2Days: 0,
      vacationDays: 0,
      backupDays: 0,
      testDays: 0,
      topicTests: 0,
      fullLengthRev1Tests: 0,
      fullLengthRev2Tests: 0
    });
    
    res.json({
      success: true,
      data: {
        exam: exam.name,
        stream: stream.name,
        preparationType: preparationTypeName,
        totalDays: studyDistribution.totalDays,
        studyDays: studyDistribution.effectiveStudyDays,
        vacationDays: studyDistribution.vacationDays,
        schedule: dailySchedule,
        subjects: subjectDistribution.subjects,
        phases: {
          z1: vacationPhases.z1,
          z2: vacationPhases.z2,
          z3: vacationPhases.z3
        },
        statistics: {
          // Original statistics
          mainCourseDays: studyPhases.mainCourseDays,
          finalRevision1Days: studyPhases.finalRevision1Days,
          finalRevision2Days: studyPhases.finalRevision2Days,
          backupDays: studyPhases.backupDays,
          
          // Enhanced schedule statistics
          scheduleBreakdown: scheduleStats,
          
          // Subject-wise breakdown
          subjectStats: subjectDistribution.subjects.map(subject => ({
            name: subject.name,
            studyDays: subject.studyDays,
            revision1Days: subject.revision1Days,
            revision2Days: subject.revision2Days,
            totalDays: subject.totalDays,
            topicCount: subject.topics.length,
            expectedTopicTests: subject.topics.length
          }))
        }
      }
    });
  } catch (error) {
    console.error('Error generating exam plan:', error);
    res.status(500).json({ error: 'Internal server error while generating exam plan' });
  }
};


// Save exam plan
exports.saveExamPlan = async (req, res) => {
  try {
    const userId = req.profile._id;
    const { examSlug, streamSlug, prepTypeSlug } = req.params;
    const examPlanData = req.body;
    
    // Get exam
    const exam = await Exam.findOne({ slug: examSlug, isActive: true });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    // Create new exam plan with enhanced structure
    const examplan = new Examplan({
      userId,
      examId: exam._id,
      exam: examSlug,
      stream: streamSlug,
      preparationType: prepTypeSlug || 'default',
      startDate: examPlanData.startDate,
      endDate: examPlanData.endDate,
      vacationStart: examPlanData.vacationStart,
      vacationEnd: examPlanData.vacationEnd,
      hasRevision: examPlanData.hasRevision,
      hasVacation: examPlanData.hasVacation,
      schedule: examPlanData.schedule,
      statistics: examPlanData.statistics,
      phases: examPlanData.phases,
      subjects: examPlanData.subjects
    });
    
    await examplan.save();
    
    // Update user's examplan field
    const user = await User.findById(userId);
    if (user) {
      user.examplan = {
        ...user.examplan,
        calendar: examplan._id,
        goal: [{
          exam: examSlug,
          stream: streamSlug,
          preparationType: prepTypeSlug || 'default',
          planId: examplan._id
        }]
      };
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'Exam plan saved successfully',
      examplan: examplan._id
    });
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};


// Get user's exam plans
exports.getUserExamPlans = async (req, res) => {
  try {
    const userId = req.profile._id;
    
    const examplans = await Examplan.find({ userId, isActive: true })
      .populate('examId', 'name slug')
      .sort({ createdAt: -1 });
    
    res.json(examplans);
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};

// Get specific exam plan
exports.getExamPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.profile._id;
    
    const examplan = await Examplan.findOne({
      _id: planId,
      userId,
      isActive: true
    }).populate('examId', 'name slug');
    
    if (!examplan) {
      return res.status(404).json({ error: 'Exam plan not found' });
    }
    
    // Mark past dates as completed and calculate progress
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    let completedDays = 0;
    let totalStudyDays = 0;
    let completedTests = 0;
    let totalTests = 0;
    
    const updatedSchedule = examplan.schedule.map(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      
      const isPast = itemDate < currentDate;
      
      if (isPast) {
        if (item.type === 'study' || item.type === 'Rev1' || item.type === 'Rev2') {
          completedDays++;
        }
        if (item.type === 'test') {
          completedTests++;
        }
      }
      
      if (item.type === 'study' || item.type === 'Rev1' || item.type === 'Rev2') {
        totalStudyDays++;
      }
      if (item.type === 'test') {
        totalTests++;
      }
      
      return {
        ...item.toObject(),
        isPast,
        isToday: itemDate.getTime() === currentDate.getTime(),
        isUpcoming: itemDate > currentDate
      };
    });
    
    // Calculate progress metrics
    const progress = {
      studyProgress: totalStudyDays > 0 ? (completedDays / totalStudyDays) * 100 : 0,
      testProgress: totalTests > 0 ? (completedTests / totalTests) * 100 : 0,
      overallProgress: examplan.schedule.length > 0 ? 
        (examplan.schedule.filter(item => {
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0);
          return itemDate < currentDate;
        }).length / examplan.schedule.length) * 100 : 0,
      
      daysRemaining: examplan.schedule.filter(item => {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= currentDate;
      }).length,
      
      testsRemaining: totalTests - completedTests,
      
      currentPhase: (() => {
        const daysPassed = examplan.schedule.filter(item => {
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0);
          return itemDate < currentDate;
        }).length;
        
        if (daysPassed <= examplan.phases?.z1) return 'Main Course';
        if (daysPassed <= examplan.phases?.z2) return 'Revision 1';
        if (daysPassed <= examplan.phases?.z3) return 'Revision 2';
        return 'Completed';
      })()
    };
    
    res.json({
      ...examplan.toObject(),
      schedule: updatedSchedule,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};


// Admin: Get all exams for management
exports.getExamsForAdmin = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};

// Admin: Create exam
exports.createExam = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};

// Admin: Update exam
exports.updateExam = async (req, res) => {
  try {
    const { examId } = req.params;
    
    const exam = await Exam.findByIdAndUpdate(examId, req.body, { new: true });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};

// Admin: Update subject weights
exports.updateSubjectWeights = async (req, res) => {
  try {
    const { examId, streamSlug, prepTypeSlug } = req.params;
    const { subjects } = req.body;
    
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    const streamIndex = exam.streams.findIndex(s => s.slug === streamSlug);
    if (streamIndex === -1) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    
    if (prepTypeSlug) {
      const prepTypeIndex = exam.streams[streamIndex].preparationTypes.findIndex(pt => pt.slug === prepTypeSlug);
      if (prepTypeIndex === -1) {
        return res.status(404).json({ error: 'Preparation type not found' });
      }
      exam.streams[streamIndex].preparationTypes[prepTypeIndex].subjects = subjects;
    } else {
      // Backward compatibility
      exam.streams[streamIndex].subjects = subjects;
    }
    
    await exam.save();
    res.json({ success: true, message: 'Subject weights updated successfully' });
  } catch (error) {
    res.status(500).json({ error: errorHandler(error) });
  }
};
