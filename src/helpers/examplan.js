// services/examplanService.js

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const differenceInDays = (date1, date2) => {
  const timeDifference = date1.getTime() - date2.getTime();
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
};

const isLeapYear = (year) => {
  return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
};

class ExamPlanService {
  static validateDates(startDate, endDate, vacationStart, vacationEnd) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return { isValid: false, error: 'End date must be after start date' };
    }
    
    if (differenceInDays(end, start) < 30) {
      return { isValid: false, error: 'Study period must be at least 30 days' };
    }
    
    if (vacationStart && vacationEnd) {
      const vacStart = new Date(vacationStart);
      const vacEnd = new Date(vacationEnd);
      
      if (vacStart >= vacEnd) {
        return { isValid: false, error: 'Vacation end date must be after start date' };
      }
      
      if (vacStart < start || vacEnd > end) {
        return { isValid: false, error: 'Vacation period must be within study period' };
      }
    }
    
    return { isValid: true };
  }

  static calculateStudyDays({ startDate, endDate, vacationStart, vacationEnd, hasVacation }) {
    const totalDaysFinal = differenceInDays(endDate, startDate) + 1;
    let totalVacationDays = 0;
    
    if (hasVacation && vacationStart && vacationEnd) {
      totalVacationDays = differenceInDays(vacationEnd, vacationStart) + 1;
    }
    
    const totalDays = totalDaysFinal - totalVacationDays;
    const mainCourseDays = this.mainCourse(totalDays);
    const finalRevision1Days = this.finalRevision1(totalDays);
    const finalRevision2Days = this.finalRevision2(totalDays);
    const backUpDays = this.buDays(totalDays);
    
    return {
      totalDaysFinal,
      totalDays,
      totalVacationDays,
      mainCourseDays,
      finalRevision1Days,
      finalRevision2Days,
      backUpDays,
      effectiveStudyDays: totalDays,
      vacationDays: totalVacationDays
    };
  }

  static calculateStudyPhases(totalDays) {
    return {
      mainCourseDays: this.mainCourse(totalDays),
      finalRevision1Days: this.finalRevision1(totalDays),
      finalRevision2Days: this.finalRevision2(totalDays),
      backupDays: this.buDays(totalDays)
    };
  }

  static mainCourse(totalDays) {
    if (totalDays < 450 && totalDays > 70) {
      return Math.floor(totalDays * 0.835);
    } else if (totalDays < 70) {
      return totalDays;
    } else {
      return Math.floor(totalDays * 0.8);
    }
  }

  static finalRevision1(totalDays) {
    if (totalDays < 450 && totalDays > 70) {
      return totalDays - Math.floor(totalDays * 0.835);
    } else if (totalDays < 70) {
      return 0;
    } else {
      return Math.floor(totalDays * 0.13);
    }
  }

  static finalRevision2(totalDays) {
    if (totalDays < 450) {
      return 0;
    } else {
      return totalDays - Math.floor(totalDays * 0.8) - Math.floor(totalDays * 0.13);
    }
  }

  static buDays(totalDays) {
    if (totalDays > 90) {
      return Math.floor(this.mainCourse(totalDays) / 30);
    } else {
      return 0;
    }
  }

  static mainSubjects(totalDays, revision) {
    if (revision) {
      return this.mainCourse(totalDays) - this.buDays(totalDays);
    } else {
      return Math.floor((this.mainCourse(totalDays) - this.buDays(totalDays)) * 0.7);
    }
  }

  static revision1(totalDays, revision) {
    if (revision) {
      return 0;
    } else {
      return this.mainCourse(totalDays) - this.buDays(totalDays) - this.mainSubjects(totalDays, revision) - this.revision2(totalDays, revision);
    }
  }

  static revision2(totalDays, revision) {
    if (revision) {
      return 0;
    } else {
      return Math.floor((this.mainCourse(totalDays) - this.buDays(totalDays)) * 0.2);
    }
  }

  static calculateVacationPhases({ startDate, vacationStart, vacationEnd, hasVacation, mainCourseDays, finalRevision1Days, finalRevision2Days, totalVacationDays }) {
    let z1 = 0, z2 = 0, z3 = 0;
    
    if (hasVacation && vacationStart && vacationEnd) {
      const vc1 = differenceInDays(vacationStart, startDate) + 1;
      const mc = mainCourseDays;
      const fr1 = finalRevision1Days;
      const fr2 = finalRevision2Days;
      
      if (vc1 > mc + fr1) {
        z1 = mc;
        z2 = mc + fr1;
        z3 = mc + fr1 + fr2 + totalVacationDays;
      } else if (vc1 > mc && vc1 <= mc + fr1) {
        z1 = mc;
        z2 = mc + fr1 + totalVacationDays;
        z3 = mc + fr1 + fr2 + totalVacationDays;
      } else {
        z1 = mc + totalVacationDays;
        z2 = mc + fr1 + totalVacationDays;
        z3 = mc + fr1 + fr2 + totalVacationDays;
      }
    } else {
      z1 = mainCourseDays;
      z2 = mainCourseDays + finalRevision1Days;
      z3 = mainCourseDays + finalRevision1Days + finalRevision2Days;
    }
    
    return { z1, z2, z3 };
  }

  static distributeSubjectDays(subjects, studyDistribution, hasRevision) {
    const { mainCourseDays, backupDays } = studyDistribution;
    const availableDays = mainCourseDays - backupDays;
    const mainSubjectsDays = hasRevision ? availableDays : Math.floor(availableDays * 0.7);
    const revision1Days = hasRevision ? 0 : Math.floor(availableDays * 0.1);
    const revision2Days = hasRevision ? 0 : availableDays - mainSubjectsDays - revision1Days;
    
    const subjectColors = [
      '#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0', '#fce4ec',
      '#e0f2f1', '#f1f8e9', '#e3f2fd', '#fff8e1', '#fafafa'
    ];
    
    const distributedSubjects = subjects.map((subject, index) => {
      const studyDays = Math.floor(mainSubjectsDays * subject.weight);
      const rev1Days = Math.floor(revision1Days * subject.weight);
      const rev2Days = Math.floor(revision2Days * subject.weight);
      
      const topics = subject.topics.map(topic => ({
        name: topic.name,
        days: Math.max(1, Math.floor(studyDays * topic.weight)),
        weight: topic.weight
      }));
      
      return {
        name: subject.name,
        studyDays,
        revision1Days: rev1Days,
        revision2Days: rev2Days,
        totalDays: studyDays + rev1Days + rev2Days,
        topics,
        color: subjectColors[index % subjectColors.length]
      };
    });
    
    return { subjects: distributedSubjects, mainSubjectsDays, revision1Days, revision2Days };
  }

  static generateDailySchedule({ startDate, endDate, vacationStart, vacationEnd, subjectDistribution, hasVacation, studyPhases }) {
    const schedule = [];
    let currentDate = new Date(startDate);
    let currentSubjectIndex = 0;
    let currentTopicIndex = 0;
    let dayInCurrentTopic = 1;
    let totalDayCounter = 1;
    let testPending = false;
    let pendingTestInfo = null;
    
    const { subjects, mainSubjectsDays, revision1Days, revision2Days } = subjectDistribution;
    const { z1, z2, z3 } = this.calculateVacationPhases({
      startDate,
      vacationStart,
      vacationEnd,
      hasVacation,
      mainCourseDays: studyPhases.mainCourseDays,
      finalRevision1Days: studyPhases.finalRevision1Days,
      finalRevision2Days: studyPhases.finalRevision2Days,
      totalVacationDays: hasVacation ? differenceInDays(vacationEnd, vacationStart) + 1 : 0
    });

    // Helper functions
    const isLastDayOfMonth = (date) => {
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return date.getDate() === lastDay.getDate();
    };

    const getCurrentPhase = (dayCounter) => {
      if (dayCounter <= z1) return 'main';
      if (dayCounter <= z2) return 'rev1';
      if (dayCounter <= z3) return 'rev2';
      return 'complete';
    };

    const addTestDay = (date, subject, topic, type = 'topic') => {
      return {
        date: new Date(date),
        type: 'test',
        testType: type, // 'topic', 'full_length_rev1', 'full_length_rev2'
        subject: subject,
        topic: type === 'topic' ? `${topic} Test` : type === 'full_length_rev1' ? 'Full Length Test - Rev1' : 'Full Length Test - Rev2',
        color: type === 'topic' ? '#9c27b0' : '#ff5722'
      };
    };

    while (currentDate <= endDate) {
      const scheduleItem = {
        date: new Date(currentDate),
        type: 'study',
        color: '#f8f9fa'
      };

      // Handle pending test first
      if (testPending && pendingTestInfo) {
        schedule.push(addTestDay(currentDate, pendingTestInfo.subject, pendingTestInfo.topic, pendingTestInfo.type));
        testPending = false;
        pendingTestInfo = null;
        currentDate = addDays(currentDate, 1);
        totalDayCounter++;
        continue;
      }

      // Vacation day check
      if (hasVacation && vacationStart && vacationEnd &&
          currentDate >= vacationStart && currentDate <= vacationEnd) {
        scheduleItem.subject = 'VACATION';
        scheduleItem.topic = 'Rest Day';
        scheduleItem.type = 'vacation';
        scheduleItem.color = '#ffc107';
        schedule.push(scheduleItem);
        currentDate = addDays(currentDate, 1);
        totalDayCounter++;
        continue;
      }

      // Check if it's last day of month for backup
      if (isLastDayOfMonth(currentDate)) {
        scheduleItem.type = 'backup';
        scheduleItem.subject = 'BACKUP';
        scheduleItem.topic = 'Buffer Day';
        scheduleItem.color = '#607d8b';
        schedule.push(scheduleItem);
        currentDate = addDays(currentDate, 1);
        totalDayCounter++;
        continue;
      }

      // Get current phase
      const currentPhase = getCurrentPhase(totalDayCounter);
      
      // Regular study/revision day
      const currentSubject = subjects[currentSubjectIndex];
      if (currentSubject && currentSubject.topics[currentTopicIndex]) {
        const currentTopic = currentSubject.topics[currentTopicIndex];
        
        scheduleItem.subject = currentSubject.name;
        scheduleItem.topic = currentTopic.name;
        scheduleItem.color = currentSubject.color;

        // Set type based on phase
        if (currentPhase === 'main') {
          scheduleItem.type = 'study';
        } else if (currentPhase === 'rev1') {
          scheduleItem.type = 'Rev1';
          scheduleItem.color = '#ff9800'; // orange for revision
        } else if (currentPhase === 'rev2') {
          scheduleItem.type = 'Rev2';
          scheduleItem.color = '#f44336'; // red for final revision
        }

        // Check if it's last day of current topic
        if (dayInCurrentTopic >= currentTopic.days) {
          scheduleItem.isLastDay = true;
          
          // Schedule a topic test for next day
          testPending = true;
          pendingTestInfo = {
            subject: currentSubject.name,
            topic: currentTopic.name,
            type: 'topic'
          };

          // Move to next topic/subject
          currentTopicIndex++;
          dayInCurrentTopic = 1;
          
          if (currentTopicIndex >= currentSubject.topics.length) {
            // End of subject - check if we need full-length tests
            const isEndOfRevision1 = (totalDayCounter + 1 === z2);
            const isEndOfRevision2 = (totalDayCounter + 1 === z3);
            
            if (isEndOfRevision1) {
              pendingTestInfo = {
                subject: 'ALL SUBJECTS',
                topic: 'Full Length Test - Rev1',
                type: 'full_length_rev1'
              };
            } else if (isEndOfRevision2) {
              pendingTestInfo = {
                subject: 'ALL SUBJECTS',
                topic: 'Full Length Test - Rev2',
                type: 'full_length_rev2'
              };
            }
            
            currentSubjectIndex++;
            currentTopicIndex = 0;
            if (currentSubjectIndex >= subjects.length) {
              currentSubjectIndex = 0; // Cycle back to first subject
            }
          }
        } else {
          dayInCurrentTopic++;
        }

        schedule.push(scheduleItem);
        currentDate = addDays(currentDate, 1);
        totalDayCounter++;
      } else {
        // No more subjects/topics, end scheduling
        break;
      }
    }

    return schedule;
  }

  static generateCompleteExamPlan({ startDate, endDate, vacationStart, vacationEnd, hasVacation, subjects, hasRevision }) {
    // Validate dates
    const validation = this.validateDates(startDate, endDate, vacationStart, vacationEnd);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    // Calculate study days and phases
    const studyDaysData = this.calculateStudyDays({ startDate, endDate, vacationStart, vacationEnd, hasVacation });
    const studyPhases = this.calculateStudyPhases(studyDaysData.totalDays);
    
    // Calculate vacation phases
    const vacationPhases = this.calculateVacationPhases({
      startDate,
      vacationStart,
      vacationEnd,
      hasVacation,
      mainCourseDays: studyPhases.mainCourseDays,
      finalRevision1Days: studyPhases.finalRevision1Days,
      finalRevision2Days: studyPhases.finalRevision2Days,
      totalVacationDays: studyDaysData.totalVacationDays
    });
    
    // Distribute subject days
    const subjectDistribution = this.distributeSubjectDays(subjects, studyPhases, hasRevision);
    
    // Generate enhanced daily schedule with tests and backup days
    const dailySchedule = this.generateDailySchedule({
      startDate,
      endDate,
      vacationStart,
      vacationEnd,
      subjectDistribution,
      hasVacation,
      studyPhases
    });
    
    return {
      studyDaysData,
      studyPhases,
      vacationPhases,
      subjectDistribution,
      dailySchedule
    };
  }
}

module.exports = ExamPlanService;
