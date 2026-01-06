/**
 * TOON (Token-Oriented Object Notation) formatter
 * https://github.com/toon-format/toon
 */

/**
 * Format analysis results as TOON
 */
export function formatAsToon(results) {
  const lines = [];

  // Header comment
  lines.push('# JS Analyzer Results');
  lines.push('# Generated: ' + new Date().toISOString());
  lines.push('');

  // Summary section
  lines.push('summary:');
  lines.push(`  total: ${results.summary.total}`);
  lines.push(`  endpoints: ${results.summary.endpoints}`);
  lines.push(`  urls: ${results.summary.urls}`);
  lines.push(`  secrets: ${results.summary.secrets}`);
  lines.push(`  emails: ${results.summary.emails}`);
  lines.push(`  files: ${results.summary.files}`);
  lines.push('');

  // Files analyzed
  const fileCount = results.files.length;
  lines.push(`files[${fileCount}]{path,status,findings}:`);
  for (const file of results.files) {
    const path = escapeToonValue(file.path);
    const status = file.status;
    const findings = file.findings;
    lines.push(`  ${path},${status},${findings}`);
  }
  lines.push('');

  // Findings by category
  lines.push('findings:');

  // Endpoints
  const endpoints = results.findings.endpoints || [];
  if (endpoints.length > 0) {
    lines.push(`  endpoints[${endpoints.length}]{value,source,line,column}:`);
    for (const finding of endpoints) {
      const value = escapeToonValue(finding.value);
      const source = escapeToonValue(finding.source);
      const line = finding.position?.line || 0;
      const column = finding.position?.column || 0;
      lines.push(`    ${value},${source},${line},${column}`);
    }
  } else {
    lines.push('  endpoints[0]: []');
  }

  // URLs
  const urls = results.findings.urls || [];
  if (urls.length > 0) {
    lines.push(`  urls[${urls.length}]{value,source,line,column}:`);
    for (const finding of urls) {
      const value = escapeToonValue(finding.value);
      const source = escapeToonValue(finding.source);
      const line = finding.position?.line || 0;
      const column = finding.position?.column || 0;
      lines.push(`    ${value},${source},${line},${column}`);
    }
  } else {
    lines.push('  urls[0]: []');
  }

  // Secrets
  const secrets = results.findings.secrets || [];
  if (secrets.length > 0) {
    lines.push(`  secrets[${secrets.length}]{value,source,line,column}:`);
    for (const finding of secrets) {
      const value = escapeToonValue(finding.value);
      const source = escapeToonValue(finding.source);
      const line = finding.position?.line || 0;
      const column = finding.position?.column || 0;
      lines.push(`    ${value},${source},${line},${column}`);
    }
  } else {
    lines.push('  secrets[0]: []');
  }

  // Emails
  const emails = results.findings.emails || [];
  if (emails.length > 0) {
    lines.push(`  emails[${emails.length}]{value,source,line,column}:`);
    for (const finding of emails) {
      const value = escapeToonValue(finding.value);
      const source = escapeToonValue(finding.source);
      const line = finding.position?.line || 0;
      const column = finding.position?.column || 0;
      lines.push(`    ${value},${source},${line},${column}`);
    }
  } else {
    lines.push('  emails[0]: []');
  }

  // Files
  const filesFindings = results.findings.files || [];
  if (filesFindings.length > 0) {
    lines.push(`  files[${filesFindings.length}]{value,source,line,column}:`);
    for (const finding of filesFindings) {
      const value = escapeToonValue(finding.value);
      const source = escapeToonValue(finding.source);
      const line = finding.position?.line || 0;
      const column = finding.position?.column || 0;
      lines.push(`    ${value},${source},${line},${column}`);
    }
  } else {
    lines.push('  files[0]: []');
  }

  return lines.join('\n');
}

/**
 * Escape special characters in TOON values
 */
function escapeToonValue(value) {
  if (typeof value !== 'string') {
    return value;
  }

  // If value contains comma, quote, or special chars, wrap in quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\\')) {
    // Escape quotes and backslashes
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
    return `"${escaped}"`;
  }

  return value;
}
