import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
    value: number[]
    onValueChange: (value: number[]) => void
    max: number
    min: number
    step: number
    className?: string
}

function Slider({ value, onValueChange, max, min, step, className }: SliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange([parseInt(e.target.value)])
    }

    const percentage = ((value[0] - min) / (max - min)) * 100

    return (
        <div className={cn("relative w-full", className)} style={{ touchAction: 'pan-x' }}>
            <div className="relative h-2 w-full rounded-full bg-white/20">
                <div
                    className="absolute h-2 rounded-full bg-gradient-to-r from-[#f94c57] to-pink-500 transition-all duration-200"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={handleChange}
                style={{ touchAction: 'pan-x' }}
                className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
            />
        </div>
    )
}

export { Slider }