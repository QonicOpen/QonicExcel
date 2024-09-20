export interface Step {
    id: string;
    stepNumber: number;
    title?: string;
}

export const Steps = {
    SELECT_MODEL: 'SELECT_MODEL',
    LOAD_DATA_FILTERS: 'LOAD_DATA_FILTERS',
    SET_DATA_FILTERS: 'SET_DATA_FILTERS',
    SET_FILTER_VALUES: 'SET_FILTER_VALUES',
    LOAD_QUERY_DATA: 'LOAD_QUERY_DATA',
    UTILIZE_DATA: 'UTILIZE_DATA',
}

export const OrderedSteps: Step[] = [
    { id: Steps.SELECT_MODEL, title: 'Data source', stepNumber: 1 },
    { id: Steps.LOAD_DATA_FILTERS, stepNumber: 1 },
    { id: Steps.SET_DATA_FILTERS, title: 'Data', stepNumber: 2 },
    { id: Steps.SET_FILTER_VALUES, title: 'Filter Data', stepNumber: 3 },
    { id: Steps.LOAD_QUERY_DATA, stepNumber: 3 },
    { id: Steps.UTILIZE_DATA, title: 'Review data', stepNumber: 4 },
]

export const stepTitle = (stepId: string) => OrderedSteps.find(step => step.id === stepId).title;
export const stepProgress = (stepId: string) => OrderedSteps.find(step => step.id === stepId).stepNumber;
export const stepIndex = (stepId: string) => OrderedSteps.findIndex(step => step.id === stepId);
export const totalSteps = 4;

export const previousStep = (stepId: string) => {
    const currentStepIndex = OrderedSteps.findIndex(step => step.id === stepId);
    return OrderedSteps.find(step => step.stepNumber === OrderedSteps[currentStepIndex].stepNumber - 1).id;
}

export const nextStep = (stepId: string) => {
    const currentStepIndex = OrderedSteps.findIndex(step => step.id === stepId);
    return OrderedSteps.find(step => step.stepNumber === OrderedSteps[currentStepIndex].stepNumber + 1).id;
}
