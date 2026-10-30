// @refresh reload
import React, { useState } from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AffordabilityPage() {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Shopping');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const safetyBuffer = 20000;

  const quickScenarios = [
    { name: 'Dinner at Fine Dining Bistro', price: 3200, category: 'Food & Dining' },
    { name: 'Sony WH-1000XM5 Headphones', price: 24990, category: 'Electronics' },
    { name: 'Ergonomic Standing Desk', price: 34500, category: 'Home & Office' },
    { name: 'iPhone 16 Pro Max 256GB', price: 144900, category: 'Electronics' },
  ];

  const runEvaluation = (nameToEval, priceToEval, catToEval) => {
    const numPrice = parseFloat(priceToEval);
    if (isNaN(numPrice) || numPrice <= 0) return;

    setIsEvaluating(true);

    setTimeout(() => {
      const isAffordable = numPrice <= safetyBuffer;
      setAssessmentResult({
        name: nameToEval || 'Custom Expense',
        price: numPrice,
        category: catToEval || category,
        isAffordable,
        impactPercent: Math.min(100, Math.round((numPrice / safetyBuffer) * 100)),
      });
      setIsEvaluating(false);
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runEvaluation(itemName, price, category);
  };

  const loadScenario = (scenario) => {
    setItemName(scenario.name);
    setPrice(scenario.price.toString());
    setCategory(scenario.category);
    runEvaluation(scenario.name, scenario.price, scenario.category);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Top Banner */}
      <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 6px 0' }}>
          Affordability Guidance Engine
        </h1>
        <p style={{ fontSize: '13px', color: '#8EA399', margin: 0 }}>
          Evaluate planned expenses against liquid reserves, monthly budget pacing, and your minimum safety buffer.
        </p>
      </div>

      {/* Main Content Grid (Left Form & Right Result Panel) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left Column: Form & Quick Test Scenarios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Assessment Form Card */}
          <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', marginBottom: '16px', marginTop: 0 }}>
              Planned Purchase Assessment
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '6px' }}>
                  Item / Service Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Keyboard, Weekend Trip, iPad Air"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '12px 16px', fontSize: '12px', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '6px' }}>
                    Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontFamily: 'monospace', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '12px 16px', fontSize: '12px', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option>Shopping</option>
                    <option>Electronics</option>
                    <option>Food & Dining</option>
                    <option>Home & Office</option>
                    <option>Travel</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                onClick={() => runEvaluation(itemName, price, category)}
                style={{ backgroundColor: '#10B981', color: '#050B09', fontWeight: 'bold', fontSize: '13px', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.2)', marginTop: '4px' }}
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Evaluating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Evaluate Affordability
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Test Scenarios Card */}
          <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#8EA399', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Quick Test Scenarios
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quickScenarios.map((sc, idx) => (
                <div
                  key={idx}
                  onClick={() => loadScenario(sc)}
                  style={{ backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#F0FDF4', marginBottom: '6px' }}>{sc.name}</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#10B981', fontFamily: 'monospace' }}>₹{sc.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Result Panel & Active Safety Buffer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Assessment Output Card */}
          <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '32px 24px', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            {!assessmentResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <Sparkles size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 8px 0' }}>Awaiting Assessment</h3>
                <p style={{ fontSize: '12px', color: '#8EA399', maxWidth: '280px', margin: 0, lineHeight: '1.5' }}>
                  Fill in the item details or select a quick scenario to inspect affordability metrics.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  {assessmentResult.isAffordable ? (
                    <ShieldCheck size={20} style={{ color: '#10B981' }} />
                  ) : (
                    <AlertTriangle size={20} style={{ color: '#FB7185' }} />
                  )}
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: assessmentResult.isAffordable ? '#10B981' : '#FB7185' }}>
                    {assessmentResult.isAffordable ? 'Affordable Purchase' : 'Exceeds Safety Buffer'}
                  </span>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 4px 0' }}>{assessmentResult.name}</h2>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#10B981', fontFamily: 'monospace', marginBottom: '16px' }}>
                  ₹{assessmentResult.price.toLocaleString()}
                </div>
                <p style={{ fontSize: '13px', color: '#8EA399', lineHeight: '1.6', margin: 0 }}>
                  {assessmentResult.isAffordable
                    ? 'This expense is comfortably within your monthly disposable limit and preserves your safety buffer.'
                    : `This expense consumes ${assessmentResult.impactPercent}% of your safety buffer setting. Deferring or pacing this purchase is advised.`}
                </p>
              </div>
            )}
          </div>

          {/* Active Safety Buffer Setting Card */}
          <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <span style={{ fontSize: '13px', color: '#8EA399', fontWeight: '500' }}>Active Safety Buffer Setting:</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#10B981', fontFamily: 'monospace' }}>₹{safetyBuffer.toLocaleString()}</span>
          </div>

        </div>

      </div>
    </div>
  );
}