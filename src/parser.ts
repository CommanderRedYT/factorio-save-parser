import type {
    FactorioSaveFile,
    SaveHeaderMod,
    Version,
    Version48,
} from '@types';
import type { CentralDirectory } from 'unzipper';

import path from 'node:path';

import { compare as compareVersions } from 'compare-versions';
import unzipper from 'unzipper';

import { InvalidArgumentError, InvalidSaveFileError } from '@/errors';

// Written with the help of the information on https://forums.factorio.com/viewtopic.php?t=47014
export function parseLevelInitData(data: DataView): FactorioSaveFile {
    let bytesOffset = 0;

    function readUint8(): number {
        // console.log(`readUint8() at offset ${bytesOffset.toString(16)}`);

        const value = data.getUint8(bytesOffset);
        bytesOffset += 1;
        return value;
    }

    function readUint16(): number {
        // console.log(`readUint16() at offset ${bytesOffset.toString(16)}`);

        const value = data.getUint16(bytesOffset, true);
        bytesOffset += 2;
        return value;
    }

    function readUint32(): number {
        // console.log(`readUint32() at offset ${bytesOffset.toString(16)}`);

        const value = data.getUint32(bytesOffset, true);
        bytesOffset += 4;
        return value;
    }

    function readBoolean(): boolean {
        return readUint8() !== 0;
    }

    function readVersion(): Version {
        const major = readUint16();
        const minor = readUint16();
        const patch = readUint16();
        const build = readUint16();
        return {
            major,
            minor,
            patch,
            build,
            // 4-number versions officially supported by compare-versions
            asString: `${major}.${minor}.${patch}.${build}`,
        };
    }

    // Read Factorio Version
    const factorioVersion = readVersion();

    function readOptimizedUint(bitSize: number): number {
        /* console.log('readOptimizedUint()', {
            bitSize,
        }); */

        if (compareVersions(factorioVersion.asString, '0.14.14', '>')) {
            const value = readUint8();

            if (value !== 0xff) {
                return value;
            }
        }

        switch (bitSize) {
            case 16:
                return readUint16();
            case 32:
                return readUint32();
            default:
                throw new Error(`Invalid bit size: ${bitSize}`);
        }
    }

    // has_empty_indicator=false
    function readString(): string {
        const length = readOptimizedUint(32);

        const bufferSlice = data.buffer.slice(
            bytesOffset,
            bytesOffset + length,
        ) as ArrayBuffer;

        bytesOffset += length;

        return new TextDecoder().decode(bufferSlice);
    }

    function readVersion48(): Version48 {
        const major = readOptimizedUint(16);
        const minor = readOptimizedUint(16);
        const patch = readOptimizedUint(16);

        return {
            major,
            minor,
            patch,
        };
    }

    // Single Unused byte
    readBoolean();

    // Read fields
    const name = readString();
    const campaign = readString();
    const baseMod = readString();
    const difficulty = readUint8();
    const finished = readBoolean();
    const playerWon = readBoolean();
    const nextLevel = readString();

    const canContinue = readBoolean();
    const finishedButContinuing = readBoolean();

    const savingReplay = readBoolean();

    const allowNonAdminDebugOptions = readBoolean();

    const loadedFrom = readVersion48();
    const loadedFromBuild =
        factorioVersion.major >= 2 ? readUint32() : readUint16();
    const allowedCommands = readBoolean();

    // 2.0 has a new header with 4 extra bytes here
    if (factorioVersion.major >= 2) {
        readUint8();
        readUint8();
        readUint8();
        readUint8();
    }

    const numMods = readOptimizedUint(32);
    const mods: SaveHeaderMod[] = [];
    for (let i = 0; i < numMods; i++) {
        mods.push({
            name: readString(),
            version: readVersion48(),
            crc: readUint32(),
        });
    }

    return {
        factorioVersion,
        name,
        campaign,
        baseMod,
        difficulty,
        finished,
        playerWon,
        nextLevel,
        canContinue,
        finishedButContinuing,
        savingReplay,
        allowNonAdminDebugOptions,
        loadedFrom,
        loadedFromBuild,
        allowedCommands,
        mods,
    };
}

export async function parseSaveFile(
    filepath: string,
): Promise<FactorioSaveFile | undefined> {
    let centralDirectory: CentralDirectory;
    let levelInitDatName = '';

    try {
        const normalizedPath = path.normalize(filepath);

        const resolvedPath = path.resolve(normalizedPath);
        const fileExtension = path.extname(filepath);
        const filename = path.basename(filepath).replace(fileExtension, '');

        // if zip file is called _autosave1.zip, make levelInitDatName contain _autosave1
        levelInitDatName = `${filename}/level-init.dat`;

        // if file does not end with .zip, it's likely not valid
        if (fileExtension !== '.zip') {
            throw new InvalidArgumentError('File path is not a zip file.');
        }

        centralDirectory = await unzipper.Open.file(resolvedPath);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return undefined;
    }

    const file = centralDirectory.files.find(f => f.path === levelInitDatName);

    if (!file) {
        throw new InvalidSaveFileError(
            'File does not appear to be a save file',
        );
    }

    const levelInitDatContent = await file?.buffer();

    if (levelInitDatContent === null) {
        throw new InvalidSaveFileError(
            'Unable to find level-init.dat in save file',
        );
    }

    const binaryData = new DataView(levelInitDatContent.buffer);

    return parseLevelInitData(binaryData);
}
