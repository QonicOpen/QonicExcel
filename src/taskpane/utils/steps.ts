export interface Step {
    id: string;
    stepNumber: number;
    title?: string;
}

export const Steps = {
    SELECT_MODEL: {id: 'SELECT_MODEL', stepNumber: 1, title: 'Data source'},
    LOAD_DATA_FILTERS: {id: 'LOAD_DATA_FILTERS', stepNumber: 1},
    SET_DATA_FILTERS: {id: 'SET_DATA_FILTERS', stepNumber: 2, title: 'Data'},
    SET_FILTER_VALUES: {id: 'SET_FILTER_VALUES', stepNumber: 3, title: 'Filter Data'},
    LOAD_QUERY_DATA: {id: 'LOAD_QUERY_DATA', stepNumber: 3},
    NO_FILTER_RESULTS: {id: 'NO_FILTER_DATA', stepNumber: 3, title: 'Filter Data'},
    UTILIZE_DATA: {id: 'UTILIZE_DATA', stepNumber: 4, title: 'Review data'},
    EDITING_ACCESS_DENIED: {id: 'EDITING_ACCESS_DENIED', stepNumber: 4, title: 'Review data'},
}

export const OrderedSteps: Step[] = [
    Steps.SELECT_MODEL,
    Steps.LOAD_DATA_FILTERS,
    Steps.SET_DATA_FILTERS,
    Steps.SET_FILTER_VALUES,
    Steps.LOAD_QUERY_DATA,
    Steps.UTILIZE_DATA,
]

export const stepTitle = (currentStep: Step) => currentStep.title;
export const stepProgress = (currentStep: Step) => currentStep.stepNumber;
export const stepIndex = (currentStep: Step) => OrderedSteps.findIndex(step => step.id === currentStep.id);

export const totalSteps = 4;

export const previousStep = (currentStep: Step): Step => {
    return OrderedSteps.find(step => step.stepNumber === currentStep.stepNumber - 1);
}
