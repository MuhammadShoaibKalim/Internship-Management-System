import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SectionHeader = ({
    title,
    subtitle,
    description,
    icon: Icon,
    linkTo,
    linkText,
    children,
    gradientFrom = "from-primary-600",
    gradientTo = "to-indigo-500",
    badgeColor = "bg-slate-100",
    badgeTextColor = "text-slate-700"
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-100/50">
            <div className="space-y-4">
                {subtitle && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${badgeColor} rounded-full border border-slate-200/50`}>
                        {Icon && <Icon size={14} className={badgeTextColor} />}
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${badgeTextColor}`}>{subtitle}</span>
                    </div>
                )}
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                        {title.split(' ').map((word, idx) => (
                            <React.Fragment key={idx}>
                                {idx === title.split(' ').length - 1 ? (
                                    <span className={`text-gradient ${gradientFrom} ${gradientTo} italic`}>{word}</span>
                                ) : (
                                    word + ' '
                                )}
                            </React.Fragment>
                        ))}
                    </h1>
                    {description && (
                        <div className="text-slate-500 text-lg font-medium mt-3 max-w-2xl leading-relaxed">
                            {description}
                        </div>
                    )}
                </div>
            </div>
            {(linkTo || linkText || children) && (
                <div className="flex shrink-0">
                    {children ? children : (
                        <Link to={linkTo} className={`btn-premium ${gradientFrom} ${gradientTo} py-3.5 px-8 group no-underline shadow-xl hover:shadow-2xl transition-all`}>
                            {linkText}
                            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default SectionHeader;
