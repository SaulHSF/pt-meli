import fs from 'node:fs';
import path from 'node:path';

const summaryPath = path.resolve(process.cwd(), 'coverage/coverage-summary.json');

if (!fs.existsSync(summaryPath)) {
  console.error(`Coverage summary not found at: ${summaryPath}`);
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const entries = Object.entries(summary).filter(([file]) => file !== 'total');

const metrics = ['lines', 'functions', 'statements', 'branches'];
const folderThresholds = [
  {
    name: 'src/domain/services',
    matcher: '/src/domain/services/',
    thresholds: {
      lines: 90,
      functions: 90,
      statements: 90,
      branches: 80,
    },
  },
  {
    name: 'src/application',
    matcher: '/src/application/',
    thresholds: {
      lines: 80,
      functions: 80,
      statements: 80,
      branches: 70,
    },
  },
];

const toPct = (covered, total) => (total > 0 ? (covered / total) * 100 : 100);

let hasErrors = false;

for (const folder of folderThresholds) {
  const files = entries.filter(([file]) =>
    file.replace(/\\/g, '/').includes(folder.matcher)
  );

  if (files.length === 0) {
    console.error(`No coverage entries found for folder: ${folder.name}`);
    hasErrors = true;
    continue;
  }

  const aggregate = {};
  for (const metric of metrics) {
    let covered = 0;
    let total = 0;
    for (const [, fileData] of files) {
      covered += fileData[metric].covered;
      total += fileData[metric].total;
    }
    aggregate[metric] = toPct(covered, total);
  }

  for (const metric of metrics) {
    const threshold = folder.thresholds[metric];
    if (aggregate[metric] < threshold) {
      console.error(
        `[coverage] ${folder.name} ${metric}: ${aggregate[metric].toFixed(2)}% < ${threshold}%`
      );
      hasErrors = true;
    } else {
      console.log(
        `[coverage] ${folder.name} ${metric}: ${aggregate[metric].toFixed(2)}% >= ${threshold}%`
      );
    }
  }
}

if (hasErrors) {
  process.exit(1);
}
