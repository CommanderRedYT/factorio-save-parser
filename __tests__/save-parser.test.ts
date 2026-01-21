/* eslint-disable no-console */
import { parseSaveFile } from '@/index';

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

        console.dir(parsed);

        expect(parsed).toBeDefined();
    });
});
