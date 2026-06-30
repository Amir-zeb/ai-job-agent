'use client';
import { useState } from 'react';

interface AccordionItem {
    title: string;
    content: React.ReactNode;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-2xl mx-auto border border-(--secondary) rounded-lg md:shadow-sm overflow-hidden">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div key={index} className="border-b border-(--secondary) last:border-b-0">
                        <button
                            onClick={() => toggleItem(index)}
                            className={`w-full flex justify-between items-center p-5 text-left font-medium  ${isOpen ? 'bg-(--secondary) text-(--primary)' : 'text-(--secondary) hover:bg-(--secondary) hover:text-(--primary) transition-colors duration-200'}`}
                            aria-expanded={isOpen}
                        >
                            <span>{item.title}</span>
                            <svg
                                className={`w-5 h-5 text-(secondary) transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-(primary)' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="p-5 text-sm leading-relaxed border-t">
                                    {item.content}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}