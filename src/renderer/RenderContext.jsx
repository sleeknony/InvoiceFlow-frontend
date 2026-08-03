import {
    createContext,
    useContext
} from "react";

const RenderContext = createContext(null);

export function RenderContextProvider({

    value,

    children

}) {

    return (

        <RenderContext.Provider value={value}>

            {children}

        </RenderContext.Provider>

    );

}

function useRenderContext() {

    const context = useContext(RenderContext);

    if (!context) {

        throw new Error(

            "RenderContextProvider is missing."

        );

    }

    return context;

}

export function useRenderDocument() {

    return useRenderContext();

}

export function useRenderPages() {

    return useRenderContext().pages;

}

export function useDocument() {

    return useRenderContext().renderDocument;

}

export function useTemplate() {

    return useRenderContext().template;

}

