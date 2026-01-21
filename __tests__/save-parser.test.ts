import { parseSaveFile } from '../src/parser';

const saveFile = './test_files/_autosave4.zip';

describe('save-parser', () => {
    it('should fail with invalid file extension', async () => {
        const parsed = await parseSaveFile('foo.bar');

        expect(parsed).toBeUndefined();
    });

    it('should fail with non-existing file', async () => {
        const parsed = await parseSaveFile('foo.zip');

        expect(parsed).toBeUndefined();
    });

    it('should parse the save-file correctly', async () => {
        const parsed = await parseSaveFile(saveFile);

        expect(parsed).toBeDefined();
        expect(parsed!.factorioVersion.major).toBe(2);
        expect(parsed!.factorioVersion.minor).toBe(0);
        expect(parsed!.factorioVersion.patch).toBe(72);
        expect(parsed!.factorioVersion.build).toBe(0);
        expect(parsed!.factorioVersion.asString).toBe('2.0.72.0');
        expect(parsed!.baseMod).toBe('base');
        expect(parsed!.campaign).toBe('freeplay');
        expect(parsed!.mods).toHaveLength(4);
        expect(parsed!.mods[0]!.name).toBe('base');
        expect(parsed!.mods[0]!.version.major).toBe(2);
        expect(parsed!.mods[0]!.version.minor).toBe(0);
        expect(parsed!.mods[0]!.version.patch).toBe(72);
        expect(parsed!.mods[0]!.crc).toBe(1879415942);
    });
});
