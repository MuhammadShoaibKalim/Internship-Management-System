import React from 'react';

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-accent/10 text-accent',
        approved: 'bg-success/10 text-success',
        endorsed: 'bg-primary/10 text-primary-600',
        rejected: 'bg-danger/10 text-danger',
        completed: 'bg-secondary/10 text-secondary-600',
    };

    return (
        <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${styles[status.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
