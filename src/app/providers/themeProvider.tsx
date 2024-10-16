'use client'

import { ThemeProvider } from "styled-components";
import { lightTheme } from "../global/theme";
import React from "react";

export default function ThemeContainer({
    children
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  
    return (
        <ThemeProvider theme={lightTheme}>
            {children}
        </ThemeProvider>
    );
  }