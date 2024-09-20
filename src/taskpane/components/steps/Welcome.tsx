import React from 'react';
import Button from "../elements/Button";

interface WelcomeProps {
    onGetStarted: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({onGetStarted}: WelcomeProps) => {
    return (
        <div className="min-h-screen flex justify-center flex-col px-5 items-center max-w-md text-center">
            <div className="flex justify-center mb-5">
                <svg viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-24 w-24">
                    <path
                        d="M12.0631 23.6176C14.9772 24.3268 18.3912 24.0731 21.0579 22.6547C22.2232 22.0279 23.4122 20.9284 23.4029 19.5763C23.4029 19.2453 23.208 18.6335 22.8073 17.7075C20.8019 13.2107 17.4018 6.99271 15.2615 3.15723C13.1246 6.99214 9.80056 13.0746 7.76576 17.5766C7.32986 18.573 7.11825 19.2268 7.11768 19.5763C7.24107 21.9564 10.0087 23.1177 12.0631 23.6176Z"
                        fill="#00E2AC"></path>
                    <path
                        d="M29.9152 14.5497C27.9075 10.0523 24.5079 3.83491 22.3676 0C21.3459 1.83299 20.0531 4.18087 18.7593 6.62331C21.2144 11.1351 23.0595 14.7769 24.2703 17.4857V17.4892V17.4921C24.7143 18.5184 24.9127 19.1642 24.9138 19.588C24.9151 19.9491 24.8504 20.3075 24.723 20.6454C25.9241 20.4465 27.0862 20.0585 28.1658 19.4957C29.3317 18.869 30.52 17.7694 30.5114 16.4173C30.5114 16.0875 30.3165 15.4763 29.9152 14.5497Z"
                        fill="#00E2AC"></path>
                    <path
                        d="M0.596243 14.5497C2.60394 10.0523 6.00352 3.83491 8.14383 0C9.16555 1.83299 10.4583 4.18087 11.7521 6.62331C9.29701 11.1351 7.45192 14.7769 6.24108 17.4857V17.4892V17.4921C5.7971 18.5184 5.59875 19.1642 5.5976 19.588C5.59633 19.9491 5.66101 20.3075 5.78845 20.6454C4.5873 20.4465 3.42526 20.0585 2.34562 19.4957C1.17975 18.8707 -0.00860195 17.7711 4.69266e-05 16.419C4.69266e-05 16.0875 0.194935 15.4763 0.596243 14.5497Z"
                        fill="#00E2AC"></path>
                </svg>
            </div>
            <h1 className="text-2xl qonic-black font-semibold mb-2">
                Welcome to Qonic Excel Add-in
            </h1>
            <p className="text-sm text-qonic-gray-400">
                This tool lets you access Qonic's public API and pull data from selected models directly into your spreadsheet.
            </p>
            <Button className="my-10" onPress={onGetStarted}>
                Get started
            </Button>
        </div>
    );
};