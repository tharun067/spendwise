import { useContext } from "react";
import { MonthlySavingsContext } from "../contexts/MonthlySavingsContext";

export const useMonthlySavings = () => {
    return useContext(MonthlySavingsContext);
};