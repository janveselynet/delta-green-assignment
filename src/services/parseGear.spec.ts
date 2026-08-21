import { parseGear } from './parseGear'

describe(parseGear.name, () => {
    const dataSet = [
        {
            title: 'should parse neutral gear',
            value: 'N',
            expected: 0,
        },
        {
            title: 'should parse standard numeric gears',
            value: '3',
            expected: 3,
        },
    ]

    it.each(dataSet)('$title', ({ value, expected }) => {
        expect(parseGear(value)).toBe(expected);
    });
});
