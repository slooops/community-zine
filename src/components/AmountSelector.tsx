'use client';

import { useState } from 'react';
import { inputClass } from './Button';

const PRESETS = [5, 10, 20];

interface Props {
  value: number;
  onChange: (cents: number) => void;
}

export default function AmountSelector({ value, onChange }: Props) {
  const [custom, setCustom] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const selectedDollars = value / 100;

  const selectPreset = (dollars: number) => {
    setCustom(false);
    setInputVal('');
    onChange(dollars * 100);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setInputVal(raw);
    const dollars = parseInt(raw, 10);
    if (!isNaN(dollars) && dollars >= 5) {
      onChange(dollars * 100);
    }
  };

  const presetBase =
    'px-5 py-2.5 rounded-none border font-semibold text-sm transition';
  const presetActive = 'bg-[#D94550] text-white border-[#D94550]';
  const presetInactive =
    'bg-transparent text-white border-gray-700 hover:border-gray-400';

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-800">
        Amount{' '}
        <span className="normal-case font-normal text-gray-600">(minimum $5)</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => selectPreset(d)}
            className={`${presetBase} ${!custom && selectedDollars === d ? presetActive : presetInactive}`}
          >
            ${d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setCustom(true);
            setInputVal('');
            onChange(500);
          }}
          className={`${presetBase} ${custom ? presetActive : presetInactive}`}
        >
          Custom
        </button>
      </div>

      {custom && (
        <div className="flex items-center gap-2">
          <span className="text-gray-500">$</span>
          <input
            type="number"
            min={5}
            placeholder="Amount"
            value={inputVal}
            onChange={handleCustomChange}
            className={`${inputClass} w-28`}
            autoFocus
          />
          <span className="text-gray-500 text-sm"></span>
        </div>
      )}

      {!custom && (
        <p className="text-sm text-gray-500">
          ${selectedDollars} — thank you!
        </p>
      )}
    </div>
  );
}
