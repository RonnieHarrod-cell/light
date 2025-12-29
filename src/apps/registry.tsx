import React from "react";
import ExampleApp from "./ExampleApp";

export interface AppDefinition {
    id: string;
    title: string;
    width: number;
    height: number;
    icon?: string;
    component: React.ReactNode;
}

export const APPS: AppDefinition[] = [
    {
        id: "example",
        title: "Example App",
        width: 480,
        height: 320,
        component: <ExampleApp />
    }
];
