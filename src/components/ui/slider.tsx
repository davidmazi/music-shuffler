import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
    value: number[]
    onValueChange: (value: number[]) => void
    onValueCommit?: () => void
    max: number
    min: number
    step: number
    className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
    ({ value, onValueChange, onValueCommit, max, min, step, className }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChange([parseInt(e.target.value)])
        }

        const handleMouseUp = () => {
            onValueCommit?.()
        }

        const handleTouchEnd = () => {
            onValueCommit?.()
        }

        const percentage = ((value[0] - min) / (max - min)) * 100

        return (
            <div
                ref={ref}
                className={cn("relative w-full", className)}
                style={{ touchAction: 'pan-x' }}
            >
                <div className="relative h-3 w-full rounded-full bg-white/20">
                    <div
                        className="absolute h-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary"
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
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleTouchEnd}
                    style={{ touchAction: 'pan-x' }}
                    className="absolute inset-0 h-3 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                />
            </div>
        )
    }
)

Slider.displayName = "Slider"

export { Slider }