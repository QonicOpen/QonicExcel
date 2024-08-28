import * as React from "react";
import Header from "./Header";
import {ModelSelector} from "./ModelSelector";
import {ApiTokenContext, configureAuth} from "../utils/auth";
import {ModelDataQuery} from "./ModelDataQuery";
import {Toaster} from 'react-hot-toast';
import {ModelProvider} from "../utils/models";


const App: React.FC = () => {
    const apiToken = configureAuth()

    return (
        <ApiTokenContext.Provider value={apiToken}>
            <ModelProvider>
                <div className="h-screen">
                    <Toaster position="top-center" reverseOrder={false}/>
                    <Header/>
                    <div className="flex flex-col">
                        <ModelSelector/>
                        <ModelDataQuery/>
                    </div>
                </div>
            </ModelProvider>
        </ApiTokenContext.Provider>
    );
};

export default App;
