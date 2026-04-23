'use client';

import { useState } from 'react';

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

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Monthly amount <span className="text-gray-400">(minimum $5)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => selectPreset(d)}
            className={`px-5 py-2 rounded border font-semibold transition ${
              !custom && selectedDollars === d
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
            }`}
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
          className={`px-5 py-2 rounded border font-semibold transition ${
            custom
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
          }`}
        >
          Custom
        </button>
      </div>

      {custom && (
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-lg">$</span>
          <input
            type="number"
            min={5}
            placeholder="Enter amount"
            value={inputVal}
            onChange={handleCustomChange}
            className="w-32 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            autoFocus
          />
          <span className="text-gray-500">/month</span>
        </div>
      )}

      {!custom && (
        <p className="text-sm text-gray-500">
          ${selectedDollars}/month — thank you for supporting ComMunity!
        </p>
      )}
    </div>
  );
}
