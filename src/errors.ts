export class InvalidArgumentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidArgumentError';
        Object.setPrototypeOf(this, InvalidArgumentError.prototype);
    }
}

export class InvalidSaveFileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidSaveFileError';
        Object.setPrototypeOf(this, InvalidSaveFileError.prototype);
    }
}
