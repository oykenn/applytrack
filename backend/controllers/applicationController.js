const pool = require("../db");

// ADD APPLICATION
const addApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      company_name,
      position,
      application_type,
      work_setup,
      location,
      job_link,
      status,
      date_applied,
      contact_person,
      contact_email,
      interview_date,
      interview_time,
      interview_mode,
      meeting_link,
      notes,
    } = req.body;

    if (!company_name || !position) {
      return res.status(400).json({
        success: false,
        message: "Company name and position are required",
      });
    }

    // Convert empty strings from Angular forms into null for PostgreSQL DATE/TIME fields
    const cleanDateApplied = date_applied || null;
    const cleanInterviewDate = interview_date || null;
    const cleanInterviewTime = interview_time || null;

    const result = await pool.query(
      `
      INSERT INTO applications (
        user_id,
        company_name,
        position,
        application_type,
        work_setup,
        location,
        job_link,
        status,
        date_applied,
        contact_person,
        contact_email,
        interview_date,
        interview_time,
        interview_mode,
        meeting_link,
        notes
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'Pending'),
        $9, $10, $11, $12, $13, $14, $15, $16
      )
      RETURNING *
      `,
      [
        userId,
        company_name,
        position,
        application_type,
        work_setup,
        location,
        job_link,
        status,
        cleanDateApplied,
        contact_person,
        contact_email,
        cleanInterviewDate,
        cleanInterviewTime,
        interview_mode,
        meeting_link,
        notes,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Application added successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Add application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding application",
      error: error.message,
    });
  }
};

// GET ALL APPLICATIONS OF LOGGED-IN USER
const getApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM applications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      applications: result.rows,
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting applications",
      error: error.message,
    });
  }
};

// GET ONE APPLICATION
const getApplicationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM applications
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Get application by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting application",
      error: error.message,
    });
  }
};

// UPDATE APPLICATION
const updateApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      company_name,
      position,
      application_type,
      work_setup,
      location,
      job_link,
      status,
      date_applied,
      contact_person,
      contact_email,
      interview_date,
      interview_time,
      interview_mode,
      meeting_link,
      notes,
    } = req.body;

    if (!company_name || !position) {
      return res.status(400).json({
        success: false,
        message: "Company name and position are required",
      });
    }

    // Convert empty strings from Angular forms into null for PostgreSQL DATE/TIME fields
    const cleanDateApplied = date_applied || null;
    const cleanInterviewDate = interview_date || null;
    const cleanInterviewTime = interview_time || null;

    const result = await pool.query(
      `
      UPDATE applications
      SET
        company_name = $1,
        position = $2,
        application_type = $3,
        work_setup = $4,
        location = $5,
        job_link = $6,
        status = $7,
        date_applied = $8,
        contact_person = $9,
        contact_email = $10,
        interview_date = $11,
        interview_time = $12,
        interview_mode = $13,
        meeting_link = $14,
        notes = $15,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $16 AND user_id = $17
      RETURNING *
      `,
      [
        company_name,
        position,
        application_type,
        work_setup,
        location,
        job_link,
        status,
        cleanDateApplied,
        contact_person,
        contact_email,
        cleanInterviewDate,
        cleanInterviewTime,
        interview_mode,
        meeting_link,
        notes,
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application updated successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating application",
      error: error.message,
    });
  }
};

// DELETE APPLICATION
const deleteApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM applications
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting application",
      error: error.message,
    });
  }
};

// UPDATE STATUS ONLY
const updateApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await pool.query(
      `
      UPDATE applications
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *
      `,
      [status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating status",
      error: error.message,
    });
  }
};

module.exports = {
  addApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
};