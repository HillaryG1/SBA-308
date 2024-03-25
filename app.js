// ///////////Instructions You will create a script that 
// gathers data, processes it, and then outputs a consistent 
// result as described by a specification. The data you will use is 
// provided below.

/////////////////
// You will be provided with four different types of data:
// A CourseInfo object, which looks like this:
// {
//   "id": number,
//   "name": string,
// }
///////////////
// An AssignmentGroup object, which looks like this:
// {
//   "id": number,
//   "name": string,
//   // the ID of the course the assignment group belongs to
//   "course_id": number,
//   // the percentage weight of the entire assignment group
//   "group_weight": number,
//   "assignments": [AssignmentInfo],
// }
////////////////////
// Each AssignmentInfo object within the assignments array looks like this:
// {
//   "id": number,
//   "name": string,
//   // the due date for the assignment
//   "due_at": Date string,
//   // the maximum points possible for the assignment
//   "points_possible": number,
// }
//////////////////
// An array of LearnerSubmission objects, which each look like this:
// {
//     "learner_id": number,
//     "assignment_id": number,
//     "submission": {
//       "submitted_at": Date string,
//       "score": number
//     }
// }
////////////////

// // Your goal is to analyze and transform this data such that the output of your program is an array 
// of objects, each containing the following information in the following format:
// {
//     // the ID of the learner for which this data has been collected
//     "id": number,
//     // the learner’s total, weighted average, in which assignments
//     // with more points_possible should be counted for more
//     // e.g. a learner with 50/100 on one assignment and 190/200 on another
//     // would have a weighted average score of 240/300 = 80%.
//     "avg": number,
//     // each assignment should have a key with its ID,
//     // and the value associated with it should be the percentage that
//     // the learner scored on the assignment (submission.score / points_possible)
//     <assignment_id>: number,
//     // if an assignment is not yet due, it should not be included in either
//     // the average or the keyed dictionary of scores
// }

/////////////
// If an AssignmentGroup does not belong to its course (mismatching course_id), 
// your program should throw an error, letting the user know that the input was 
// invalid. Similar data validation should occur elsewhere within the program.
// You should also account for potential errors in the data that your program 
// receives. What if points_possible is 0? You cannot divide by zero. What if a 
// value that you are expecting to be a number is instead a string? 
// Use try/catch and other logic to handle these types of errors gracefully.
// If an assignment is not yet due, do not include it in the results or the average. 
// Additionally, if the learner’s submission is late (submitted_at is past due_at), 
// deduct 10 percent of the total points possible from their score for that assignment.
// Create a function named getLearnerData() that accepts these values as parameters, 
// in the order listed: (CourseInfo, AssignmentGroup, [LearnerSubmission]), 
// and returns the formatted result, which should be an array of objects as described above.
// You may use as many helper functions as you see fit.

///////sample data
// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25", //on time
        score: 47  // assignment 1 score = .94
      },
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12", //early
        score: 150   // assignment 2 score = 100% or 1.0
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25", //not yet due
        score: 400 //  assignment 3 score = .8
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24", // early
        score: 39 // assignment 1 score = .78
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07", // late
        score: 140 // assignment 2 score = .93
      }
    }
  ];
  
  // Function to process learner data
  function getLearnerData(course, ag, submissions, skipAssignments = {}) {
    const result = []; // empty array to store the processed data
  
    // Validate if essential data fields are present
    if (!course.id || !ag.course_id || !ag.assignments || !submissions.every(submission => submission.learner_id && submission.assignment_id && submission.submission && submission.submission.submitted_at && submission.submission.score)) {
      throw new Error("Invalid input: Essential data fields are missing.");
    }
  
    // Validate if AssignmentGroup belongs to the course
    if (ag.course_id !== course.id) {
      throw new Error("Invalid input: AssignmentGroup does not belong to this course.");
    }
  
    // Process learner submissions
    const learners = {};
    submissionsLoop: // Label for the loop
    for (const submission of submissions) {
      const assignment = ag.assignments.find(a => a.id === submission.assignment_id);
      if (!assignment) {
        throw new Error(`Assignment with ID ${submission.assignment_id} is invalid.`);
      }
  
      // Make sure submission score doesn't exceed maximum points possible
      const score = Math.min(submission.submission.score, assignment.points_possible); //// prevent situations where score is higher than the max points
  
      const dueDate = new Date(assignment.due_at);
      const submittedDate = new Date(submission.submission.submitted_at);
      const isLate = submittedDate > dueDate;
      const latePenalty = isLate ? assignment.points_possible * 0.1 : 0;
  
      if (assignment.points_possible === 0) {
        throw new Error(`Invalid assignment: Points_possible for assignment ${assignment.id} is 0.`);
      }
  
      const adjustedScore = score - latePenalty;
      const percentage = (adjustedScore / assignment.points_possible) * 100;
  
      if (percentage < 0) {
        throw new Error(`Invalid submission: Learner score for assignment ${assignment.id} is negative after applying late penalty.`);
      }
  
      if (!learners[submission.learner_id]) {
        learners[submission.learner_id] = {
          id: submission.learner_id,
          totalScore: 0,
          totalPossible: 0,
          assignmentScores: {}
        };
      }
  
      // Check if this assignment should be skipped for this learner
      if (skipAssignments[submission.learner_id] && skipAssignments[submission.learner_id].includes(assignment.id)) {
        continue submissionsLoop;
      }
  
      learners[submission.learner_id].totalScore += adjustedScore;
      learners[submission.learner_id].totalPossible += assignment.points_possible;
      learners[submission.learner_id].assignmentScores[assignment.id] = percentage;
    }
  
    // Calculate averages and format result
    for (const learnerId in learners) {
      const learner = learners[learnerId];
      const avg = learner.totalScore / learner.totalPossible;
      const learnerData = {
        id: learner.id,
        avg: avg.toFixed(3)
      };
  
      for (const assignmentId in learner.assignmentScores) {
        if (learner.assignmentScores.hasOwnProperty(assignmentId)) {
          learnerData[assignmentId] = learner.assignmentScores[assignmentId] / 100; // convert percentage to decimal
        }
      }
  
      // Format the average score including assignment scores
      const formattedData = {};
      for (const key in learnerData) {
        if (key !== 'id' && key !== 'avg') {
          formattedData[key] = learnerData[key];
        }
      }
      formattedData['id'] = learnerData.id;
      formattedData['avg'] = parseFloat(learnerData.avg);
  
      result.push(formattedData);
    }
  
    return result;
  }
  
  // Test the function
  try {
    const skipAssignments = {
      125: [3] // Skip assignment 3 for learner 125 maybe it was a data entry error
    };
  
    const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions, skipAssignments);
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
  

  

