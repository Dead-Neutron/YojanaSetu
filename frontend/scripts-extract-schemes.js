const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'data', 'updated_data.csv');
const outPath = path.join(__dirname, 'src', 'data', 'schemes.json');

// Ensure target directory exists
fs.mkdirSync(path.dirname(outPath), { recursive: true });

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

try {
  const rawData = fs.readFileSync(csvPath, 'utf8');
  const lines = rawData.split(/\r?\n/).filter(l => l.trim().length > 0);
  
  if (lines.length < 2) {
    console.error("CSV empty or corrupted");
    process.exit(1);
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);
  console.log("Headers:", headers);

  const schemes = [];
  // Parse schemes (up to 75 high-quality schemes across central and states)
  for (let i = 1; i < Math.min(lines.length, 300); i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 5) continue;
    
    const schemeName = values[0]?.replace(/^"+|"+$/g, '').trim();
    if (!schemeName || schemeName.length < 5) continue;

    const slug = values[1] || `scheme-${i}`;
    const details = values[2]?.replace(/^"+|"+$/g, '').trim() || '';
    const benefits = values[3]?.replace(/^"+|"+$/g, '').trim() || '';
    const eligibility = values[4]?.replace(/^"+|"+$/g, '').trim() || '';
    const application = values[5]?.replace(/^"+|"+$/g, '').trim() || '';
    const documents = values[6]?.replace(/^"+|"+$/g, '').trim() || '';
    const level = values[7]?.replace(/^"+|"+$/g, '').trim() || 'Central';
    const category = values[8]?.replace(/^"+|"+$/g, '').trim() || 'Social welfare & Empowerment';
    const tags = values[10]?.replace(/^"+|"+$/g, '').trim() || '';

    // Infer state from details or level
    let state = 'All India';
    const stateMatches = [
      'Puducherry', 'Madhya Pradesh', 'Andhra Pradesh', 'Karnataka', 'West Bengal',
      'Rajasthan', 'Chhattisgarh', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh',
      'Bihar', 'Kerala', 'Odisha', 'Telangana', 'Punjab', 'Haryana', 'Assam'
    ];
    for (const s of stateMatches) {
      if (details.includes(s) || schemeName.includes(s)) {
        state = s;
        break;
      }
    }
    if (level.toLowerCase().includes('central')) {
      state = 'Central / All India';
    }

    // Infer gender
    let gender = 'All';
    if (/women|female|mahila|girl|widow/i.test(schemeName + ' ' + eligibility)) {
      gender = 'Female';
    } else if (/\bmen\b|\bmale\b/i.test(schemeName) && !/female|women/i.test(schemeName)) {
      gender = 'Male';
    }

    // Infer occupation
    let occupation = 'All Citizens';
    if (/farmer|kisan|agriculture/i.test(schemeName + ' ' + details + ' ' + tags)) {
      occupation = 'Farmer';
    } else if (/student|scholarship|training|education|faculty/i.test(schemeName + ' ' + details + ' ' + tags)) {
      occupation = 'Student';
    } else if (/construction|labor|worker|unregistered laborer/i.test(schemeName + ' ' + details + ' ' + tags)) {
      occupation = 'Construction / Unorganized Worker';
    } else if (/fisherman|fisherwomen/i.test(schemeName + ' ' + details + ' ' + tags)) {
      occupation = 'Fisherman';
    } else if (/enterprise|msme|entrepreneur|business/i.test(schemeName + ' ' + details + ' ' + tags)) {
      occupation = 'Entrepreneur / MSME';
    }

    // Infer caste
    let caste = 'All';
    if (/scheduled tribe|\bst\b/i.test(schemeName + ' ' + eligibility + ' ' + tags)) {
      caste = 'ST';
    } else if (/scheduled caste|\bsc\b/i.test(schemeName + ' ' + eligibility + ' ' + tags)) {
      caste = 'SC';
    } else if (/obc|other backward/i.test(schemeName + ' ' + eligibility + ' ' + tags)) {
      caste = 'OBC';
    }

    schemes.push({
      id: schemes.length + 1,
      scheme_name: schemeName,
      slug: slug,
      details: details,
      benefits: benefits,
      eligibility: eligibility,
      application: application,
      documents: documents,
      level: level,
      state: state,
      category: category.split(',')[0].trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      gender: gender,
      occupation: occupation,
      caste: caste
    });

    if (schemes.length >= 65) break;
  }

  fs.writeFileSync(outPath, JSON.stringify(schemes, null, 2), 'utf8');
  console.log(`Successfully extracted ${schemes.length} verified schemes to ${outPath}`);
} catch (err) {
  console.error("Error extracting schemes:", err);
  process.exit(1);
}
