const fs = require('fs');
const path = require('path');

function processFile(inputFilePath, outputFilePath) {
    try {
        const data = fs.readFileSync(inputFilePath, 'utf-8');
        const uniqueIntegers = new Set();

        data.split('\n').forEach(line => {
            const num = parseInt(line.trim(), 10);
            if (!isNaN(num) && num >= -1023 && num <= 1023) {
                uniqueIntegers.add(num);
            }
        });

        const sortedUniqueIntegers = [...uniqueIntegers].sort((a, b) => a - b);
        fs.writeFileSync(outputFilePath, sortedUniqueIntegers.join('\n'));

        console.log(`File processed successfully: ${outputFilePath}`);
    } catch (error) {
        console.error(`Error processing file: ${error.message}`);
    }
}

// Example;
const inputFilePath = path.join(__dirname, '../sample_inputs/sample_01.txt');
const outputFilePath = path.join(__dirname, '../sample_results/sample_02.txt_result.txt');

processFile(inputFilePath, outputFilePath);
