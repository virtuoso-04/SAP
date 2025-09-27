import express from 'express';
import { getAttendees } from '../utils/dbUtils.js';

const router = express.Router();

// GET /api/admin/attendees - Get all attendees (admin only)
router.get('/attendees', async (req, res) => {
  try {
    const { category, format, checked_in } = req.query;
    let attendees = await getAttendees();
    
    // Filter by category if specified
    if (category) {
      attendees = attendees.filter(a => a.category === category);
    }
    
    // Filter by check-in status if specified
    if (checked_in !== undefined) {
      const checkInStatus = checked_in === 'true';
      attendees = attendees.filter(a => a.checked_in === checkInStatus);
    }
    
    // Handle CSV export format
    if (format === 'csv') {
      // Define CSV headers based on attendee type
      const commonHeaders = ['Registration ID', 'Full Name', 'Email', 'Mobile', 'Category', 'Food Choice', 'Country', 'Gender', 'Check-in Status'];
      const professionalHeaders = [...commonHeaders, 'Company', 'Designation'];
      const studentHeaders = [...commonHeaders, 'College', 'Education Level', 'Year'];
      
      // Start with common headers for the first row
      let csvContent = professionalHeaders.join(',') + '\n';
      
      // Add data rows
      csvContent += attendees.map(a => {
        const commonData = [
          a.registration_id,
          `"${a.full_name}"`, // Quote names in case they contain commas
          a.email,
          a.mobile,
          a.category,
          a.food_choice || '',
          `"${a.country}"`, // Quote countries in case they contain commas
          a.gender || '',
          a.checked_in ? 'Yes' : 'No'
        ];
        
        // Add category-specific fields
        if (a.category === 'Professional') {
          return [
            ...commonData,
            `"${a.company || ''}"`,
            `"${a.designation || ''}"`,
            '', // Empty college field
            '', // Empty education level field
            ''  // Empty year field
          ].join(',');
        } else {
          return [
            ...commonData,
            '', // Empty company field
            '', // Empty designation field
            `"${a.college || ''}"`,
            a.education_level || '',
            a.year || ''
          ].join(',');
        }
      }).join('\n');
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=attendees.csv');
      return res.send(csvContent);
    }
    
    // Default JSON response
    res.json(attendees);
  } catch (error) {
    console.error('Error fetching attendees:', error);
    res.status(500).json({ error: 'Failed to fetch attendees' });
  }
});

// GET /api/admin/stats - Get event statistics
router.get('/stats', async (req, res) => {
  try {
    const attendees = await getAttendees();
    
    // Calculate statistics
    const totalAttendees = attendees.length;
    const checkedIn = attendees.filter(a => a.checked_in).length;
    const professionals = attendees.filter(a => a.category === 'Professional').length;
    const students = attendees.filter(a => a.category === 'Student').length;
    
    // Count unique countries
    const countries = {};
    attendees.forEach(a => {
      if (a.country) {
        countries[a.country] = (countries[a.country] || 0) + 1;
      }
    });
    
    // Count food preferences
    const foodChoices = {};
    attendees.forEach(a => {
      if (a.food_choice) {
        foodChoices[a.food_choice] = (foodChoices[a.food_choice] || 0) + 1;
      }
    });
    
    // Calculate check-in rate
    const checkInRate = totalAttendees > 0 ? (checkedIn / totalAttendees * 100).toFixed(1) : 0;
    
    res.json({
      totalAttendees,
      checkedIn,
      checkInRate: `${checkInRate}%`,
      professionals,
      students,
      countries,
      foodChoices
    });
  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({ error: 'Failed to generate event statistics' });
  }
});

export default router;