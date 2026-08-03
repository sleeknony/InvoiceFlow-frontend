import { useContext } from "react";
import RenderContext from "./RenderContext";

export default function useRenderContext() {
    return useContext(RenderContext);
}