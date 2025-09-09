class AssignmentService {
    static processAssignment(score, leadName) {
        console.log(`Processing assignment for ${leadName} with score: ${score}`);
        
        let assignedTo;
        let category;
        
        if (score >= 70) {
            assignedTo = 'Senior Sales Rep';
            category = 'High Priority';
        } else if (score >= 40) {
            assignedTo = 'Junior Sales Rep';
            category = 'Medium Priority';
        } else {
            assignedTo = 'Nurture Later';
            category = 'Low Priority';
        }
        
        console.log(`Assignment Result: ${assignedTo} (${category})`);
        
        return {
            score: score,
            assignedTo: assignedTo,
            category: category,
            message: `Lead scored ${score} and assigned to ${assignedTo}`
        };
    }
    
    static getAssignmentRules() {
        return {
            high: { min: 70, max: 100, assignTo: 'Senior Sales Rep' },
            medium: { min: 40, max: 69, assignTo: 'Junior Sales Rep' },
            low: { min: 0, max: 39, assignTo: 'Nurture Later' }
        };
    }
}

module.exports = AssignmentService;