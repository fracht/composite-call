import { prepareSequence } from '../../src/lib/prepareSequence';
import { AnyFunction, CallInfo, PATH_IDENTIFIER } from '../../src/lib/typings';

/**
 * These sequences are shared between 1 and 2 test suites.
 * Each sequence member index should be 0, and each name in the sequence should be unique, for correct test work.
 */
const defaultSequences = [
    [
        {
            name: 'hello',
            parameters: [0, 1, 'asdf', new Date()],
            index: 0,
        },
        {
            name: 'bye',
            index: 0,
            parameters: [
                15,
                {
                    deep: { value: 'asdf' },
                },
                {
                    deepArray: [
                        0,
                        15,
                        new Date(),
                        {
                            value: 'asdf',
                        },
                    ],
                },
            ],
        },
    ],

    [
        {
            name: 'hello',
            parameters: [[[[], [{ arr: [[[]]] }]]], 1, 'asdf', new Date()],
            index: 0,
        },
        {
            name: 'bye',
            index: 0,
            parameters: [15, 1, 0x1500f],
        },
    ],

    [
        {
            name: 'hello',
            parameters: [[[[], [{ arr: [[[]]] }]]], 1, 'asdf', new Date()],
            index: 0,
        },
        {
            name: 'bye',
            index: 0,
            parameters: ['asdf'],
        },
        {
            name: 'a',
            parameters: {
                h: 'asdf',
                b: 'asdf',
                c: { d: { e: { f: [{}, {}, {}] } } },
            },
            index: 0,
        },
        {
            name: 'c',
            index: 0,
            parameters: 15,
        },
    ],
] as Array<Array<CallInfo<AnyFunction>>>;

describe('prepareSequence', () => {
    it('should throw error if sequence members have same names and indexes', () => {
        expect(() =>
            prepareSequence([
                { parameters: [], name: 'hello', index: 0 },
                { parameters: [], name: 'hello', index: 0 },
            ])
        ).toThrow();
    });
    it('should return identical sequence', () => {
        defaultSequences.forEach((seq) => {
            const prepared = prepareSequence(seq);
            // should contain same values.
            expect(prepared).toStrictEqual(seq);
            // but not be the same object.
            expect(prepared).not.toBe(seq);
        });
    });
    it('should compute minimal indexes for same calls', () => {
        defaultSequences
            .map((sequence) =>
                sequence.map((callInfo) => ({
                    ...callInfo,
                    index: Math.floor(Math.random() * 500),
                }))
            )
            .forEach((seq, index) =>
                expect(prepareSequence(seq)).toStrictEqual(
                    defaultSequences[index]
                )
            );
    });
    it('should compute minimal equal indexes for different calls', () => {
        expect(
            prepareSequence([
                {
                    name: 'hello',
                    index: 52,
                    parameters: [1, 2],
                },
                {
                    name: 'hello',
                    index: 128,
                    parameters: [15, 20],
                },
                {
                    name: 'hello',
                    index: 1,
                    parameters: ['asdf', 'bye'],
                },
                {
                    name: 'test',
                    index: 338,
                    parameters: [
                        {
                            [PATH_IDENTIFIER]: {
                                index: 52,
                                name: 'hello',
                                path: ['0'],
                            },
                        },
                        {
                            hello: {
                                world: {
                                    [PATH_IDENTIFIER]: {
                                        index: 128,
                                        name: 'hello',
                                        path: ['1'],
                                    },
                                },
                            },
                        },
                        [
                            [
                                {
                                    inArray: [
                                        {
                                            [PATH_IDENTIFIER]: {
                                                index: 1,
                                                name: 'hello',
                                                path: ['1'],
                                            },
                                        },
                                    ],
                                },
                            ],
                            [[[0]]],
                        ],
                    ],
                },
            ])
        ).toStrictEqual([
            {
                name: 'hello',
                index: 0,
                parameters: [1, 2],
            },
            {
                name: 'hello',
                index: 1,
                parameters: [15, 20],
            },
            {
                name: 'hello',
                index: 2,
                parameters: ['asdf', 'bye'],
            },
            {
                name: 'test',
                index: 0,
                parameters: [
                    {
                        [PATH_IDENTIFIER]: {
                            index: 0,
                            name: 'hello',
                            path: ['0'],
                        },
                    },
                    {
                        hello: {
                            world: {
                                [PATH_IDENTIFIER]: {
                                    index: 1,
                                    name: 'hello',
                                    path: ['1'],
                                },
                            },
                        },
                    },
                    [
                        [
                            {
                                inArray: [
                                    {
                                        [PATH_IDENTIFIER]: {
                                            index: 2,
                                            name: 'hello',
                                            path: ['1'],
                                        },
                                    },
                                ],
                            },
                        ],
                        [[[0]]],
                    ],
                ],
            },
        ]);
    });
});
