const fs = require('fs');
const path = require('path');

const dirsToClean = ['allure-results', 'html-report', 'test-results'];

dirsToClean.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Cleaned directory: ${dir}`);
    }
});
