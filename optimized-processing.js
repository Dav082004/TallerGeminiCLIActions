/**
 * High-Performance Data Processing Utilities
 * 
 * Optimized functions for handling large datasets with proper memory management,
 * async operations, and performance monitoring.
 * 
 * @author Development Team
 * @version 1.0.0
 * @since 2025-08-10
 */

const fs = require('fs').promises;
const { Transform, pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);

// Performance monitoring constants
const PERFORMANCE_THRESHOLDS = {
    MAX_MEMORY_MB: 500,
    MAX_PROCESSING_TIME_MS: 30000,
    CHUNK_SIZE: 64 * 1024, // 64KB chunks
    MAX_FILE_SIZE_MB: 100
};

/**
 * Memory-efficient file processor with streaming
 */
class FileProcessor {
    /**
     * Process large files using streams to avoid memory issues
     * @param {string} inputPath - Path to input file
     * @param {string} outputPath - Path to output file
     * @param {Function} transformFunction - Processing function
     * @returns {Promise<Object>} Processing statistics
     */
    static async processLargeFile(inputPath, outputPath, transformFunction) {
        const startTime = Date.now();
        const stats = {
            linesProcessed: 0,
            bytesProcessed: 0,
            errors: 0
        };

        try {
            // Validate file size before processing
            const fileStats = await fs.stat(inputPath);
            const fileSizeMB = fileStats.size / (1024 * 1024);
            
            if (fileSizeMB > PERFORMANCE_THRESHOLDS.MAX_FILE_SIZE_MB) {
                throw new Error(`File too large: ${fileSizeMB.toFixed(2)}MB exceeds ${PERFORMANCE_THRESHOLDS.MAX_FILE_SIZE_MB}MB limit`);
            }

            const transformStream = new Transform({
                objectMode: true,
                transform(chunk, encoding, callback) {
                    try {
                        const processed = transformFunction(chunk.toString());
                        stats.linesProcessed++;
                        stats.bytesProcessed += chunk.length;
                        callback(null, processed);
                    } catch (error) {
                        stats.errors++;
                        callback(error);
                    }
                }
            });

            await pipelineAsync(
                fs.createReadStream(inputPath, { highWaterMark: PERFORMANCE_THRESHOLDS.CHUNK_SIZE }),
                transformStream,
                fs.createWriteStream(outputPath)
            );

            const processingTime = Date.now() - startTime;
            
            return {
                ...stats,
                processingTimeMs: processingTime,
                avgThroughputMBps: (stats.bytesProcessed / (1024 * 1024)) / (processingTime / 1000)
            };

        } catch (error) {
            throw new Error(`File processing failed: ${error.message}`);
        }
    }

    /**
     * Memory-safe JSON processing with validation
     * @param {string} jsonString - JSON string to parse
     * @returns {Object} Parsed and validated JSON
     */
    static safeJsonParse(jsonString) {
        if (!jsonString || typeof jsonString !== 'string') {
            throw new Error('Invalid JSON string provided');
        }

        if (jsonString.length > 1024 * 1024) { // 1MB limit
            throw new Error('JSON string too large for safe parsing');
        }

        try {
            return JSON.parse(jsonString);
        } catch (error) {
            throw new Error(`JSON parsing failed: ${error.message}`);
        }
    }
}

/**
 * Optimized mathematical operations with memoization
 */
class MathUtils {
    constructor() {
        this.fibonacciCache = new Map();
        this.factorialCache = new Map();
    }

    /**
     * Efficient Fibonacci calculation with memoization
     * @param {number} n - Fibonacci number to calculate
     * @returns {number} Fibonacci result
     */
    fibonacci(n) {
        if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
            throw new Error('Input must be a non-negative integer');
        }

        if (n > 1000) {
            throw new Error('Input too large: maximum value is 1000');
        }

        if (this.fibonacciCache.has(n)) {
            return this.fibonacciCache.get(n);
        }

        let result;
        if (n <= 1) {
            result = n;
        } else {
            result = this.fibonacci(n - 1) + this.fibonacci(n - 2);
        }

        this.fibonacciCache.set(n, result);
        return result;
    }

    /**
     * Async CPU-intensive task with proper yielding
     * @param {number} iterations - Number of iterations
     * @returns {Promise<number>} Calculation result
     */
    async cpuIntensiveTask(iterations = 1000000) {
        if (iterations > 10000000) { // 10M limit
            throw new Error('Iterations exceed maximum allowed limit');
        }

        const startTime = Date.now();
        let result = 0;
        const batchSize = 100000;

        for (let i = 0; i < iterations; i += batchSize) {
            const endBatch = Math.min(i + batchSize, iterations);
            
            // Process batch
            for (let j = i; j < endBatch; j++) {
                result += Math.sin(j) * Math.cos(j);
            }

            // Yield control to event loop periodically
            if (i % (batchSize * 10) === 0) {
                await new Promise(resolve => setImmediate(resolve));
                
                // Check if we're taking too long
                if (Date.now() - startTime > PERFORMANCE_THRESHOLDS.MAX_PROCESSING_TIME_MS) {
                    throw new Error('Processing timeout: operation taking too long');
                }
            }
        }

        return result;
    }

    /**
     * Clear caches to prevent memory leaks
     */
    clearCaches() {
        this.fibonacciCache.clear();
        this.factorialCache.clear();
    }
}

/**
 * Safe buffer operations with validation
 */
class BufferUtils {
    /**
     * Safe buffer creation with size validation
     * @param {string} input - Input string
     * @param {number} maxSize - Maximum buffer size
     * @returns {Buffer} Safe buffer
     */
    static createSafeBuffer(input, maxSize = 1024) {
        if (!input || typeof input !== 'string') {
            throw new Error('Input must be a non-empty string');
        }

        const inputLength = Buffer.byteLength(input, 'utf8');
        
        if (inputLength > maxSize) {
            throw new Error(`Input exceeds maximum buffer size: ${inputLength} > ${maxSize}`);
        }

        const buffer = Buffer.alloc(Math.max(inputLength, 16)); // Minimum 16 bytes
        const written = buffer.write(input, 'utf8');
        
        return buffer.slice(0, written);
    }
}

module.exports = {
    FileProcessor,
    MathUtils,
    BufferUtils,
    PERFORMANCE_THRESHOLDS
};
