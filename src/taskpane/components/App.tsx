import * as React from "react";
import {AuthProvider} from "../providers/AuthProvider";
import StepComponent from "./StepComponent";
import {WorksheetProvider} from "../providers/WorksheetProvider";
import {Welcome} from "./steps/Welcome";
import {ErrorBoundary} from "react-error-boundary";
import {Fallback} from "./elements/Fallback";
import {Toaster} from "react-hot-toast";


const App: React.FC = () => {
    const [showWelcome, setShowWelcome] = React.useState<boolean>(true);

    return (
        <WorksheetProvider>
            <AuthProvider>
                <ErrorBoundary FallbackComponent={Fallback}>
                    <div><Toaster/></div>
                    <div className="min-h-screen">
                        {showWelcome
                            ? <Welcome onGetStarted={() => setShowWelcome(false)}/>
                            : <StepComponent/>}
                    </div>
                </ErrorBoundary>
            </AuthProvider>
        </WorksheetProvider>
    );
};

export default App;
