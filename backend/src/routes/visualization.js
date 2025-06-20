const express = require('express');
const { getDatabase } = require('../database/init');

const router = express.Router();

// GET /api/visualization/soil-data/:reportId - Get soil data for visualization
router.get('/soil-data/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const db = getDatabase();

    // Get report details
    const getReport = `
      SELECT id, file_name, upload_timestamp, ocr_confidence, processing_status
      FROM soil_reports 
      WHERE id = ?
    `;

    const report = await new Promise((resolve, reject) => {
      db.get(getReport, [reportId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!report) {
      db.close();
      return res.status(404).json({
        error: 'Report not found',
        message: 'The specified soil analysis report does not exist'
      });
    }

    // Get soil parameters
    const getParameters = `
      SELECT parameter_name, parameter_value, parameter_unit, parameter_status,
             optimal_min, optimal_max, confidence_score
      FROM soil_parameters 
      WHERE report_id = ?
      ORDER BY parameter_name
    `;

    const parameters = await new Promise((resolve, reject) => {
      db.all(getParameters, [reportId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    db.close();

    // Format data for visualization
    const visualizationData = {
      report: {
        id: report.id,
        fileName: report.file_name,
        uploadTimestamp: report.upload_timestamp,
        ocrConfidence: report.ocr_confidence,
        processingStatus: report.processing_status
      },
      parameters: parameters.map(p => ({
        name: p.parameter_name,
        value: p.parameter_value,
        unit: p.parameter_unit,
        status: p.parameter_status,
        optimal: {
          min: p.optimal_min,
          max: p.optimal_max
        },
        confidence: p.confidence_score,
        // Calculate percentage of optimal range
        optimalPercentage: calculateOptimalPercentage(p.parameter_value, p.optimal_min, p.optimal_max)
      })),
      charts: generateChartData(parameters),
      summary: generateSummary(parameters)
    };

    res.json(visualizationData);

  } catch (error) {
    console.error('Get visualization data error:', error);
    res.status(500).json({
      error: 'Failed to retrieve visualization data',
      message: error.message
    });
  }
});

// GET /api/visualization/comparison - Compare multiple reports
router.get('/comparison', async (req, res) => {
  try {
    const { reportIds } = req.query;
    
    if (!reportIds) {
      return res.status(400).json({
        error: 'Missing report IDs',
        message: 'Please provide reportIds as comma-separated values'
      });
    }

    const ids = reportIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    
    if (ids.length === 0) {
      return res.status(400).json({
        error: 'Invalid report IDs',
        message: 'Please provide valid numeric report IDs'
      });
    }

    const db = getDatabase();
    const comparisonData = [];

    for (const reportId of ids) {
      // Get report details
      const getReport = `
        SELECT id, file_name, upload_timestamp
        FROM soil_reports 
        WHERE id = ? AND processing_status = 'completed'
      `;

      const report = await new Promise((resolve, reject) => {
        db.get(getReport, [reportId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (report) {
        // Get parameters
        const getParameters = `
          SELECT parameter_name, parameter_value, parameter_unit, parameter_status
          FROM soil_parameters 
          WHERE report_id = ?
        `;

        const parameters = await new Promise((resolve, reject) => {
          db.all(getParameters, [reportId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });

        comparisonData.push({
          reportId: report.id,
          fileName: report.file_name,
          uploadTimestamp: report.upload_timestamp,
          parameters: parameters.reduce((acc, p) => {
            acc[p.parameter_name] = {
              value: p.parameter_value,
              unit: p.parameter_unit,
              status: p.parameter_status
            };
            return acc;
          }, {})
        });
      }
    }

    db.close();

    // Generate comparison charts
    const comparisonCharts = generateComparisonCharts(comparisonData);

    res.json({
      reports: comparisonData,
      charts: comparisonCharts,
      metadata: {
        totalReports: comparisonData.length,
        requestedReports: ids.length,
        parameters: getUniqueParameters(comparisonData)
      }
    });

  } catch (error) {
    console.error('Get comparison data error:', error);
    res.status(500).json({
      error: 'Failed to retrieve comparison data',
      message: error.message
    });
  }
});

// GET /api/visualization/trends/:userId - Get trends for a user
router.get('/trends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { parameter, limit = 10 } = req.query;
    const db = getDatabase();

    let query = `
      SELECT sr.id, sr.upload_timestamp, sp.parameter_name, sp.parameter_value, sp.parameter_unit
      FROM soil_reports sr
      JOIN soil_parameters sp ON sr.id = sp.report_id
      WHERE sr.user_id = ? AND sr.processing_status = 'completed'
    `;
    let params = [userId];

    if (parameter) {
      query += ' AND sp.parameter_name = ?';
      params.push(parameter);
    }

    query += ' ORDER BY sr.upload_timestamp DESC LIMIT ?';
    params.push(parseInt(limit));

    const trendData = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    db.close();

    // Group by parameter and create trend lines
    const trends = {};
    trendData.forEach(row => {
      if (!trends[row.parameter_name]) {
        trends[row.parameter_name] = {
          parameter: row.parameter_name,
          unit: row.parameter_unit,
          data: []
        };
      }
      trends[row.parameter_name].data.push({
        reportId: row.id,
        timestamp: row.upload_timestamp,
        value: row.parameter_value
      });
    });

    // Sort data points by timestamp
    Object.values(trends).forEach(trend => {
      trend.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    res.json({
      userId: userId,
      parameter: parameter || 'all',
      trends: Object.values(trends),
      metadata: {
        totalDataPoints: trendData.length,
        parameters: Object.keys(trends),
        dateRange: {
          from: trendData.length > 0 ? Math.min(...trendData.map(d => new Date(d.upload_timestamp))) : null,
          to: trendData.length > 0 ? Math.max(...trendData.map(d => new Date(d.upload_timestamp))) : null
        }
      }
    });

  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({
      error: 'Failed to retrieve trend data',
      message: error.message
    });
  }
});

// Helper functions
function calculateOptimalPercentage(value, min, max) {
  if (value === null || value === undefined) return 0;
  if (value < min) return Math.max(0, (value / min) * 100);
  if (value > max) return Math.min(100, 100 - ((value - max) / max) * 50);
  return 100; // Within optimal range
}

function generateChartData(parameters) {
  const chartData = {
    radar: {
      labels: parameters.map(p => p.parameter_name),
      datasets: [{
        label: 'Current Values',
        data: parameters.map(p => calculateOptimalPercentage(p.parameter_value, p.optimal_min, p.optimal_max)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }]
    },
    bar: {
      labels: parameters.map(p => p.parameter_name),
      datasets: [
        {
          label: 'Current Values',
          data: parameters.map(p => p.parameter_value),
          backgroundColor: parameters.map(p => getStatusColor(p.parameter_status))
        },
        {
          label: 'Optimal Min',
          data: parameters.map(p => p.optimal_min),
          backgroundColor: 'rgba(75, 192, 192, 0.5)'
        },
        {
          label: 'Optimal Max',
          data: parameters.map(p => p.optimal_max),
          backgroundColor: 'rgba(255, 159, 64, 0.5)'
        }
      ]
    },
    pie: {
      labels: ['Optimal', 'Low', 'Deficient'],
      datasets: [{
        data: [
          parameters.filter(p => p.parameter_status === 'optimal').length,
          parameters.filter(p => p.parameter_status === 'low').length,
          parameters.filter(p => p.parameter_status === 'deficient').length
        ],
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336']
      }]
    }
  };

  return chartData;
}

function generateSummary(parameters) {
  const total = parameters.length;
  const optimal = parameters.filter(p => p.parameter_status === 'optimal').length;
  const low = parameters.filter(p => p.parameter_status === 'low').length;
  const deficient = parameters.filter(p => p.parameter_status === 'deficient').length;

  return {
    totalParameters: total,
    optimalCount: optimal,
    lowCount: low,
    deficientCount: deficient,
    healthScore: Math.round((optimal / total) * 100),
    recommendations: generateHealthRecommendations(parameters)
  };
}

function generateComparisonCharts(comparisonData) {
  if (comparisonData.length === 0) return {};

  const parameters = getUniqueParameters(comparisonData);
  
  return {
    line: {
      labels: comparisonData.map(d => d.fileName),
      datasets: parameters.map((param, index) => ({
        label: param,
        data: comparisonData.map(d => d.parameters[param]?.value || 0),
        borderColor: getParameterColor(index),
        backgroundColor: getParameterColor(index, 0.2),
        borderWidth: 2,
        fill: false
      }))
    }
  };
}

function getUniqueParameters(comparisonData) {
  const paramSet = new Set();
  comparisonData.forEach(d => {
    Object.keys(d.parameters).forEach(param => paramSet.add(param));
  });
  return Array.from(paramSet);
}

function getStatusColor(status) {
  const colors = {
    optimal: 'rgba(76, 175, 80, 0.8)',
    low: 'rgba(255, 152, 0, 0.8)',
    deficient: 'rgba(244, 67, 54, 0.8)'
  };
  return colors[status] || 'rgba(158, 158, 158, 0.8)';
}

function getParameterColor(index, alpha = 1) {
  const colors = [
    `rgba(54, 162, 235, ${alpha})`,
    `rgba(255, 99, 132, ${alpha})`,
    `rgba(255, 159, 64, ${alpha})`,
    `rgba(75, 192, 192, ${alpha})`,
    `rgba(153, 102, 255, ${alpha})`,
    `rgba(255, 205, 86, ${alpha})`
  ];
  return colors[index % colors.length];
}

function generateHealthRecommendations(parameters) {
  const recommendations = [];
  
  parameters.forEach(p => {
    if (p.parameter_status === 'deficient') {
      recommendations.push(`${p.parameter_name} is critically low. Immediate action required.`);
    } else if (p.parameter_status === 'low') {
      recommendations.push(`${p.parameter_name} needs improvement. Consider soil amendments.`);
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Soil health is good. Continue current practices.');
  }

  return recommendations;
}

module.exports = router;
