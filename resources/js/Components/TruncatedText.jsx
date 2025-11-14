import { useState } from 'react';

export default function TruncatedText({ text, maxLength = 200 }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (text.length <= maxLength) {
        return <span>{text}</span>;
    }

    return (
        <div>
            <div
                className={`transition-all duration-300 ${
                    isExpanded ? 'max-h-full' : 'max-h-20 overflow-hidden'
                }`}
            >
                {text}
            </div>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                {isExpanded ? 'Show Less' : 'Show More'}
            </button>
        </div>
    );
}
