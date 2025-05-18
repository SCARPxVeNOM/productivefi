'use client';

import * as React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

interface CountSelectorProps {
    value: number;
    onValueChange: (value: number) => void;
}

export function CountSelector({ value, onValueChange }: CountSelectorProps) {
    return (
        <Select
            value={value.toString()}
            onValueChange={(val) => onValueChange(parseInt(val))}
        >
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Count" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
            </SelectContent>
        </Select>
    );
} 