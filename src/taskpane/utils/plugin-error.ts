export enum PluginErrors {
    LoginFailed = "LoginFailed",
    LoadProjectsFailed = "LoadProjectsFailed",
    LoadModelsFailed = "LoadModelsFailed",
    LoadPropertiesFailed = "LoadPropertiesFailed",
    ImportDataFailed = "ImportDataFailed",
    SaveDataFailed = "SaveDataFailed",
    CreateWorksheetFailed = "CreateWorksheetFailed",
}

export class PluginError extends Error {
    errorType: PluginErrors

    constructor (errorType: PluginErrors, message = undefined) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }

        this.errorType = errorType
    }
}
