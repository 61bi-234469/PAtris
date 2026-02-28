#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { decoder, encoder, Field } = require('tetris-fumen');

const DIGIT_TO_BLOCK = ['_', 'I', 'J', 'S', 'O', 'Z', 'L', 'T', 'X'];
const BLOCK_TO_DIGIT = {
    '_': '0',
    EMPTY: '0',
    I: '1',
    J: '2',
    S: '3',
    O: '4',
    Z: '5',
    L: '6',
    T: '7',
    X: '8',
    GRAY: '8',
};

function sanitizeAscii(value) {
    return String(value ?? '')
        .replace(/[\r\n]+/g, ' ')
        .replace(/[^\x20-\x7E]/g, '?')
        .trim();
}

function printOk(fields) {
    console.log('OK=1');
    for (const [key, value] of Object.entries(fields)) {
        console.log(`${key}=${sanitizeAscii(value)}`);
    }
}

function printError(code, message) {
    console.log('OK=0');
    console.log(`ERR=${sanitizeAscii(code)}`);
    console.log(`MSG=${sanitizeAscii(message)}`);
}

function parseArgs(argv) {
    if (argv.length < 3) {
        throw new Error('usage: node bridge.js <encode|decode> --input <file>');
    }

    const mode = String(argv[2]).toLowerCase();
    let inputPath = '';

    for (let i = 3; i < argv.length; i += 1) {
        if (argv[i] === '--input' && i + 1 < argv.length) {
            inputPath = argv[i + 1];
            i += 1;
        }
    }

    if (mode !== 'encode' && mode !== 'decode') {
        throw new Error('mode must be encode or decode');
    }

    if (!inputPath) {
        throw new Error('--input is required');
    }

    return { mode, inputPath };
}

function parseKeyValueFile(inputPath) {
    const text = fs.readFileSync(inputPath, 'utf8');
    const values = {};

    for (const line of text.split(/\r?\n/)) {
        if (!line) continue;
        const index = line.indexOf('=');
        if (index <= 0) continue;

        const key = line.slice(0, index).trim().toUpperCase();
        const value = line.slice(index + 1).trim();
        values[key] = value;
    }

    return values;
}

function normalizeHold(value) {
    const hold = String(value ?? '-').trim().toUpperCase();
    if (hold === '' || hold === '-') return '-';
    if (/^[TIOLJSZ]$/.test(hold)) return hold;
    throw new Error('HOLD must be one of I,J,L,O,S,T,Z,-');
}

function normalizeQueue(value) {
    return String(value ?? '')
        .toUpperCase()
        .replace(/[^TIOLJSZ]/g, '');
}

function normalizeFumenToken(value) {
    const raw = String(value ?? '').trim();
    if (!raw) {
        throw new Error('FUMEN is required');
    }

    const matched = raw.match(/v115@[A-Za-z0-9+/?]+/i);
    if (!matched) {
        throw new Error('v115 token not found');
    }
    return matched[0];
}

function boardDigitsToField(board) {
    if (!/^[0-8]{230}$/.test(board)) {
        throw new Error('BOARD must be 230 digits (0-8)');
    }

    let field = '';
    for (let i = 0; i < board.length; i += 1) {
        field += DIGIT_TO_BLOCK[Number(board[i])] ?? '_';
    }
    return field;
}

function fieldToBoardDigits(field) {
    let result = '';
    for (let y = 22; y >= 0; y -= 1) {
        for (let x = 0; x < 10; x += 1) {
            const cell = String(field.at(x, y)).toUpperCase();
            result += BLOCK_TO_DIGIT[cell] ?? '0';
        }
    }
    return result;
}

function parseQuiz(comment) {
    const match = String(comment ?? '').match(/#Q=\[([TIOLJSZ]?)\]\(([TIOLJSZ]?)\)([TIOLJSZ]*)/i);
    if (!match) {
        return { hasQuiz: false, hold: '-', queue: '' };
    }

    const hold = (match[1] || '-').toUpperCase();
    const current = (match[2] || '').toUpperCase();
    const next = (match[3] || '').toUpperCase();
    return {
        hasQuiz: true,
        hold: hold || '-',
        queue: current + next,
    };
}

function runEncode(values) {
    const board = String(values.BOARD ?? '');
    const hold = normalizeHold(values.HOLD ?? '-');
    const queue = normalizeQueue(values.QUEUE ?? '');
    const holdForQuiz = hold === '-' ? '' : hold;
    const current = queue.length > 0 ? queue[0] : '';
    const next = queue.length > 1 ? queue.slice(1) : '';

    const field = Field.create(boardDigitsToField(board), '__________');
    const comment = `#Q=[${holdForQuiz}](${current})${next}`;
    const token = encoder.encode([
        {
            field,
            comment,
            flags: {
                quiz: true,
                lock: true,
                colorize: true,
            },
        },
    ]);

    return { FUMEN: token };
}

function runDecode(values) {
    const token = normalizeFumenToken(values.FUMEN ?? '');
    const pages = decoder.decode(token);
    if (!Array.isArray(pages) || pages.length === 0) {
        throw new Error('No pages decoded');
    }

    const page = pages[pages.length - 1];
    const quiz = parseQuiz(page.comment);
    const board = fieldToBoardDigits(page.field);

    return {
        BOARD: board,
        HAS_QUIZ: quiz.hasQuiz ? '1' : '0',
        HOLD: quiz.hold,
        QUEUE: quiz.queue,
        PAGES: String(pages.length),
        USED_PAGE: 'last',
    };
}

function main() {
    try {
        const args = parseArgs(process.argv);
        const values = parseKeyValueFile(args.inputPath);
        const output = args.mode === 'encode' ? runEncode(values) : runDecode(values);
        printOk(output);
        process.exit(0);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        printError('bridge_failure', message);
        process.exit(1);
    }
}

main();
