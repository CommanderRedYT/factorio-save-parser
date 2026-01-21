export declare interface SaveHeaderMod {
    name: string;
    version: Version48;
    crc?: number;
}

export declare interface Version48 {
    major: number; // uint16
    minor: number; // uint16
    patch: number; // uint16
}

export declare interface Version {
    major: number;
    minor: number;
    patch: number;
    build: number;
    asString: string;
}

export declare interface FactorioSaveFile {
    factorioVersion: Version;
    campaign: string;
    name: string;
    baseMod: string;
    difficulty: number;
    finished: boolean;
    playerWon: boolean;
    nextLevel: string;
    canContinue: boolean;
    finishedButContinuing: boolean;
    savingReplay: boolean;
    allowNonAdminDebugOptions: boolean;
    loadedFrom: Version48;
    loadedFromBuild: number;
    allowedCommands: boolean;
    mods: SaveHeaderMod[];
}
