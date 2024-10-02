const fs = require('fs').promises;

class SparseMatrix {
    constructor(filePath = null, numRows = null, numCols = null) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.elements = {};

        if (filePath) {
            this.loadFromFile(filePath);
        }
    }

    async loadFromFile(filePath) {
        try {
            const text = await fs.readFile(filePath, 'utf8');
            const lines = text.split('\n');

            // Read dimensions
            const rowsLine = lines[0].trim().split('=');
            const colsLine = lines[1].trim().split('=');

            if (rowsLine.length < 2 || colsLine.length < 2) {
                throw new Error("Input file has wrong format: Missing dimensions");
            }

            this.numRows = parseInt(rowsLine[1]);
            this.numCols = parseInt(colsLine[1]);

            // Read non-zero entries
            for (let i = 2; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line === "") continue;

                try {
                    if (!line.startsWith('(') || !line.endsWith(')')) {
                        throw new Error(`Input file has wrong format: ${line}`);
                    }

                    const [row, col, val] = line.slice(1, -1).split(',').map(x => Number(x.trim()));
                    this.elements[`${row},${col}`] = val;
                } catch (error) {
                    throw new Error(`Input file has wrong format at line: "${line}"`);
                }
            }

            console.log("Matrix loaded successfully:", this.elements);

        } catch (error) {
            console.error(`Error loading matrix from file: ${error.message}`);
        }
    }

    getElement(row, col) {
        return this.elements[`${row},${col}`] || 0;
    }

    setElement(row, col, value) {
        if (value === 0) {
            delete this.elements[`${row},${col}`];
        } else {
            this.elements[`${row},${col}`] = value;
        }
    }

    add(other) {
        if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
            throw new Error("Matrices must have the same dimensions for addition");
        }

        const result = new SparseMatrix(null, this.numRows, this.numCols);
        result.elements = { ...this.elements };

        for (const key in other.elements) {
            const [r, c] = key.split(',').map(Number);
            result.setElement(r, c, result.getElement(r, c) + other.elements[key]);
        }

        return result;
    }

}

// Example of usage from given sample inputs
(async () => {
    const matrix1 = new SparseMatrix('easy_sample_02_1.txt');
    const matrix2 = new SparseMatrix('easy_sample_02_2.txt');
    
    await Promise.all([matrix1.loadFromFile('easy_sample_02_1.txt'), matrix2.loadFromFile('easy_sample_02_2.txt')]);
    
    const resultMatrix = matrix1.add(matrix2);
    console.log(resultMatrix);
})();