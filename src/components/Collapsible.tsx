/**
 * Componente Collapsible
 *
 * Limita seu conteúdo a uma `collapsedHeight` compartilhada para que cards irmãos
 * se alinhem à mesma altura por padrão. Quando o conteúdo é mais alto que essa altura,
 * ele aplica um fade no overflow e revela um botão "Ver mais / Ver menos".
 *
 * Se o conteúdo já couber, nenhum botão é mostrado e o painel renderiza em sua
 * altura natural.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface CollapsibleProps {
    /** Altura máxima (px) do conteúdo enquanto colapsado. */
    collapsedHeight?: number;
    children: ReactNode;
}

export function Collapsible({ collapsedHeight = 360, children }: CollapsibleProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);

    // Rastreia a altura natural do conteúdo para detectar overflow e
    // animar max-height para um valor concreto.
    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        const measure = () => setContentHeight(el.scrollHeight);
        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [children]);

    const isOverflowing = contentHeight > collapsedHeight + 1;
    const maxHeight = isOverflowing && !expanded ? collapsedHeight : contentHeight;

    return (
        <div>
            <div
                className="relative overflow-hidden transition-[max-height] duration-300 ease-out"
                style={{ maxHeight: isOverflowing || expanded ? maxHeight : undefined }}
            >
                <div ref={contentRef}>{children}</div>

                {isOverflowing && !expanded && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent" />
                )}
            </div>

            {isOverflowing && (
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    aria-expanded={expanded}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink-50 py-2 text-sm font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-800"
                >
                    {expanded ? 'Ver menos' : 'Ver mais'}
                    <svg
                        className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}
        </div>
    );
}
