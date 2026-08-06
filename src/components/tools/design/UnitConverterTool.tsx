import React, { useState } from 'react';
import { ArrowLeftRight, Calculator } from 'lucide-react';

interface UnitConverterToolProps {
  onShowToast: (message: string) => void;
}

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data' | 'time';

interface UnitDef {
  name: string;
  factor: number; // Ratio to base unit
}

const CATEGORIES: Record<UnitCategory, { label: string; base: string; units: Record<string, UnitDef> }> = {
  length: {
    label: 'Length',
    base: 'meter',
    units: {
      millimeter: { name: 'Millimeters (mm)', factor: 0.001 },
      centimeter: { name: 'Centimeters (cm)', factor: 0.01 },
      meter: { name: 'Meters (m)', factor: 1 },
      kilometer: { name: 'Kilometers (km)', factor: 1000 },
      inch: { name: 'Inches (in)', factor: 0.0254 },
      foot: { name: 'Feet (ft)', factor: 0.3048 },
      yard: { name: 'Yards (yd)', factor: 0.9144 },
      mile: { name: 'Miles (mi)', factor: 1609.344 }
    }
  },
  weight: {
    label: 'Weight & Mass',
    base: 'gram',
    units: {
      milligram: { name: 'Milligrams (mg)', factor: 0.001 },
      gram: { name: 'Grams (g)', factor: 1 },
      kilogram: { name: 'Kilograms (kg)', factor: 1000 },
      metric_ton: { name: 'Metric Tons (t)', factor: 1000000 },
      ounce: { name: 'Ounces (oz)', factor: 28.3495 },
      pound: { name: 'Pounds (lb)', factor: 453.592 }
    }
  },
  temperature: {
    label: 'Temperature',
    base: 'celsius',
    units: {
      celsius: { name: 'Celsius (°C)', factor: 1 },
      fahrenheit: { name: 'Fahrenheit (°F)', factor: 1 },
      kelvin: { name: 'Kelvin (K)', factor: 1 }
    }
  },
  area: {
    label: 'Area',
    base: 'sq_meter',
    units: {
      sq_meter: { name: 'Square Meters (m²)', factor: 1 },
      sq_km: { name: 'Square Kilometers (km²)', factor: 1000000 },
      sq_foot: { name: 'Square Feet (sq ft)', factor: 0.092903 },
      acre: { name: 'Acres (ac)', factor: 4046.86 },
      hectare: { name: 'Hectares (ha)', factor: 10000 }
    }
  },
  volume: {
    label: 'Volume',
    base: 'liter',
    units: {
      milliliter: { name: 'Milliliters (ml)', factor: 0.001 },
      liter: { name: 'Liters (l)', factor: 1 },
      cubic_meter: { name: 'Cubic Meters (m³)', factor: 1000 },
      gallon: { name: 'US Gallons (gal)', factor: 3.78541 },
      fluid_ounce: { name: 'US Fluid Ounces (fl oz)', factor: 0.0295735 }
    }
  },
  speed: {
    label: 'Speed',
    base: 'm_s',
    units: {
      m_s: { name: 'Meters per second (m/s)', factor: 1 },
      km_h: { name: 'Kilometers per hour (km/h)', factor: 0.277778 },
      mph: { name: 'Miles per hour (mph)', factor: 0.44704 },
      knot: { name: 'Knots (kn)', factor: 0.514444 }
    }
  },
  data: {
    label: 'Data Storage',
    base: 'byte',
    units: {
      bit: { name: 'Bits (b)', factor: 0.125 },
      byte: { name: 'Bytes (B)', factor: 1 },
      kilobyte: { name: 'Kilobytes (KB)', factor: 1024 },
      megabyte: { name: 'Megabytes (MB)', factor: 1048576 },
      gigabyte: { name: 'Gigabytes (GB)', factor: 1073741824 },
      terabyte: { name: 'Terabytes (TB)', factor: 1099511627776 }
    }
  },
  time: {
    label: 'Time',
    base: 'second',
    units: {
      millisecond: { name: 'Milliseconds (ms)', factor: 0.001 },
      second: { name: 'Seconds (s)', factor: 1 },
      minute: { name: 'Minutes (min)', factor: 60 },
      hour: { name: 'Hours (h)', factor: 3600 },
      day: { name: 'Days (d)', factor: 86400 },
      week: { name: 'Weeks (wk)', factor: 604800 },
      year: { name: 'Years (yr)', factor: 31536000 }
    }
  }
};

export const UnitConverterTool: React.FC<UnitConverterToolProps> = ({ onShowToast }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('meter');
  const [toUnit, setToUnit] = useState<string>('foot');

  const currentCategory = CATEGORIES[category];

  const convertValue = (valStr: string, fromKey: string, toKey: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return 0;

    if (category === 'temperature') {
      let celsius = val;
      if (fromKey === 'fahrenheit') celsius = (val - 32) * (5 / 9);
      if (fromKey === 'kelvin') celsius = val - 273.15;

      if (toKey === 'celsius') return celsius;
      if (toKey === 'fahrenheit') return celsius * (9 / 5) + 32;
      if (toKey === 'kelvin') return celsius + 273.15;
    }

    const fromFactor = currentCategory.units[fromKey]?.factor || 1;
    const toFactor = currentCategory.units[toKey]?.factor || 1;
    const baseVal = val * fromFactor;
    return baseVal / toFactor;
  };

  const convertedValue = convertValue(inputValue, fromUnit, toUnit);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCategoryChange = (catKey: UnitCategory) => {
    setCategory(catKey);
    const keys = Object.keys(CATEGORIES[catKey].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📏</span> Universal Unit Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert length, weight, area, volume, temperature, data storage, speed & time units.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORIES) as UnitCategory[]).map((catKey) => (
          <button
            key={catKey}
            onClick={() => handleCategoryChange(catKey)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
              category === catKey
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {CATEGORIES[catKey].label}
          </button>
        ))}
      </div>

      {/* Conversion Main Interface */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">From Value & Unit</label>
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold text-slate-900 dark:text-white"
            />
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            >
              {Object.entries(currentCategory.units).map(([key, def]) => (
                <option key={key} value={key}>{def.name}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Converted Result</label>
            <div className="w-full px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {Number.isFinite(convertedValue) ? convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '0'}
            </div>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            >
              {Object.entries(currentCategory.units).map(([key, def]) => (
                <option key={key} value={key}>{def.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick All-Unit Breakdown Table */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          All {currentCategory.label} Conversions for {inputValue || '0'} {currentCategory.units[fromUnit]?.name}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(currentCategory.units).map(([uKey, uDef]) => {
            const res = convertValue(inputValue, fromUnit, uKey);
            return (
              <div key={uKey} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-500 uppercase">{uDef.name}</div>
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {res.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
