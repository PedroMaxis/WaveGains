import { useState } from 'react';
import { Calculator, Zap, TrendingUp } from 'lucide-react';
import { calculateOneRM, getRPEFromPercentage, getPercentageFromRPE } from '../utils/calculations';

const CalculatorsView = () => {
  const [activeTab, setActiveTab] = useState<'1rm' | 'rpe' | 'volume'>('1rm');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Calculadoras
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Ferramentas para otimizar seu treinamento
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-dark-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('1rm')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === '1rm'
              ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>1RM</span>
        </button>
        
        <button
          onClick={() => setActiveTab('rpe')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'rpe'
              ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>RPE</span>
        </button>
        
        <button
          onClick={() => setActiveTab('volume')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'volume'
              ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Volume</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === '1rm' && <OneRMCalculator />}
      {activeTab === 'rpe' && <RPECalculator />}
      {activeTab === 'volume' && <VolumeCalculator />}
    </div>
  );
};

const OneRMCalculator = () => {
  const [weight, setWeight] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const oneRMResult = calculateOneRM(weight, reps);
    setResult(oneRMResult);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Calculadora de 1RM
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Peso levantado (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="input-field"
              step="2.5"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Repetições realizadas
            </label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="input-field"
              min="1"
              max="15"
            />
          </div>
          
          <button
            onClick={handleCalculate}
            className="btn-primary w-full"
          >
            Calcular 1RM
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Resultado
          </h3>
          
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-primary-600">
              {result.estimated1RM} kg
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              1RM Estimado (Fórmula de Epley)
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Tabela de Percentuais
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(result.percentages).map(([percent, weight]) => (
                <div key={percent} className="flex justify-between p-2 bg-gray-50 dark:bg-dark-700 rounded">
                  <span className="font-medium">{percent}%:</span>
                  <span>{String(weight)} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RPECalculator = () => {
  const [rpe, setRpe] = useState<number>(8);
  const [percentage, setPercentage] = useState<number>(85);
  const [mode, setMode] = useState<'rpe-to-percent' | 'percent-to-rpe'>('rpe-to-percent');

  const rpeResult = mode === 'rpe-to-percent' ? getPercentageFromRPE(rpe) : getRPEFromPercentage(percentage);

  return (
    <div className="card max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Conversor RPE ↔ Porcentagem
      </h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setMode('rpe-to-percent')}
            className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
              mode === 'rpe-to-percent'
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-dark-600'
            }`}
          >
            RPE → Porcentagem
          </button>
          <button
            onClick={() => setMode('percent-to-rpe')}
            className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
              mode === 'percent-to-rpe'
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-dark-600'
            }`}
          >
            Porcentagem → RPE
          </button>
        </div>

        {mode === 'rpe-to-percent' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              RPE ({rpe})
            </label>
            <input
              type="range"
              min="5"
              max="10"
              step="0.5"
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {mode === 'percent-to-rpe' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Porcentagem do 1RM ({percentage}%)
            </label>
            <input
              type="range"
              min="60"
              max="100"
              step="1"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-primary-600">
            {mode === 'rpe-to-percent' ? `${rpeResult.percentage}%` : `RPE ${rpeResult.rpe}`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {rpeResult.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const VolumeCalculator = () => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Calculadora de Volume
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Calculadora de volume em desenvolvimento.
      </p>
    </div>
  );
};

export default CalculatorsView;
