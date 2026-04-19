import React from 'react'

const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    }

    return (
        <div className={`animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/25 dark:border-t-white ${sizeClasses[size]} ${className}`} />
    )
}

export default LoadingSpinner