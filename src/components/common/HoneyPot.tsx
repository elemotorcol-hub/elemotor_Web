'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * HoneyPot Component
 * Level 3 Infrastructure/Governance Validation.
 * A trap for bots: a field invisible to humans but visible to bots.
 * If filled, the submission is rejected.
 */
export function HoneyPot() {
    const { register } = useFormContext();

    return (
        <div className="absolute opacity-0 -z-50 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="nickname">Leave this field empty</label>
            <input
                id="nickname"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('nickname')}
            />
        </div>
    );
}
