const express = require('express');
const router = express.Router();
const excelJS = require('exceljs');
const mongoose = require('mongoose');
const getDateRange = require('../utils/dateRange');

// Models
const User = require('../models/user');
const Faculty = require('../models/faculty');
const Patent = require('../models/patent');
const Publication = require('../models/publish');
const AcademicEvent = require('../models/academicEvent');
// Add more collections here

// Mapping for dynamic collection access
const collectionMap = {
  patents: Patent,
  publications: Publication,
  academicevents: AcademicEvent,
};

router.get('/export/excel', async (req, res) => {
  try {
    const { scope = 'school', departmentId, facultyId, range = 'all', year, month, quarter, half, collection } = req.query;

    if (!collectionMap[collection]) {
      return res.status(400).json({ error: 'Invalid collection type.' });
    }

    const Model = collectionMap[collection.toLowerCase()];
    const hoiUser = await User.findById(req.user._id).populate('faculty'); // To get HOI's school info

    let filter = {};

    // 🔍 Determine Faculty Scope
    if (scope === 'faculty' && facultyId) {
      filter.faculty = facultyId;
    } else if (scope === 'department' && departmentId) {
      const deptFaculties = await Faculty.find({ department: departmentId }).select('_id');
      filter.faculty = { $in: deptFaculties.map(f => f._id) };
    } else {
      // Default: School-wide
      const schoolFaculties = await Faculty.find({ school: hoiUser.faculty.school }).select('_id');
      filter.faculty = { $in: schoolFaculties.map(f => f._id) };
    }

    // 📅 Time Range Filter
    const dateRange = getDateRange(range, year, month, quarter, half);
    if (dateRange) {
      filter.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate };
    }

    const docs = await Model.find(filter).populate('faculty');

    // 📄 Create Excel Workbook
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Exported Data');

    // Define columns (adjust as needed)
    const sample = docs[0];
    if (!sample) {
      return res.status(404).json({ error: 'No records found for export.' });
    }

    const columns = Object.keys(sample.toObject()).map(key => ({ header: key, key }));
    worksheet.columns = columns;

    docs.forEach(doc => {
      worksheet.addRow(doc.toObject());
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${collection}_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Export Error:', err);
    res.status(500).json({ error: 'Failed to export Excel.' });
  }
});

module.exports = router;