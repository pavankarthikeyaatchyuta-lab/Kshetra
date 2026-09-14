import { useState, useEffect } from 'react';
import type { Field, Observation, Intervention, EvidencePackage, Language } from './models/types';
import { 
  getSavedField, 
  saveField, 
  getSavedObservations, 
  addObservation, 
  deleteObservation, 
  getSavedInterventions, 
  addIntervention, 
  deleteIntervention, 
  getSavedEvidencePackages, 
  saveEvidencePackages, 
  deleteEvidencePackage, 
  clearDemoDataAndReset, 
  INITIAL_FIELD, 
  INITIAL_OBSERVATIONS, 
  INITIAL_INTERVENTIONS, 
  createInitialEvidencePackage 
} from './services/storage';

import { SplashScreen } from './components/splash/SplashScreen';
import { Header } from './components/navigation/Header';
import { BottomNav } from './components/navigation/BottomNav';
import type { TabKey } from './components/navigation/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { ScanScreen } from './screens/ScanScreen';
import { PassportScreen } from './screens/PassportScreen';
import { EvidenceScreen } from './screens/EvidenceScreen';
import { OfficeScreen } from './screens/OfficeScreen';
import { MoreScreen } from './screens/MoreScreen';
import { WifiOff } from 'lucide-react';

export function App() {
  // Navigation & View state
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [viewMode, setViewMode] = useState<'field' | 'office'>('field');
  const [language, setLanguage] = useState<Language>('en');

  // Network State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

  // Data Store state
  const [field, setField] = useState<Field>(getSavedField());
  const [observations, setObservations] = useState<Observation[]>(getSavedObservations());
  const [interventions, setInterventions] = useState<Intervention[]>(getSavedInterventions());
  const [evidencePackages, setEvidencePackages] = useState<EvidencePackage[]>([]);

  // Load evidence packages asynchronously on mount
  useEffect(() => {
    getSavedEvidencePackages().then(setEvidencePackages);
  }, []);

  // Monitor real browser network status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Sync field state
  const handleUpdateField = (updatedField: Field) => {
    setField(updatedField);
    saveField(updatedField);
  };

  // Add observation
  const handleAddObservation = (obs: Observation) => {
    const updated = addObservation(obs);
    setObservations(updated);
  };

  // Delete observation
  const handleDeleteObservation = (id: string) => {
    const updated = deleteObservation(id);
    setObservations(updated);
  };

  // Add intervention
  const handleAddIntervention = (int: Intervention) => {
    const updated = addIntervention(int);
    setInterventions(updated);
  };

  // Delete intervention
  const handleDeleteIntervention = (id: string) => {
    const updated = deleteIntervention(id);
    setInterventions(updated);
  };

  // Save evidence package
  const handleSaveEvidencePackage = (pkg: EvidencePackage) => {
    const updated = [pkg, ...evidencePackages];
    setEvidencePackages(updated);
    saveEvidencePackages(updated);
  };

  // Update evidence package (e.g. after tamper or verify)
  const handleUpdateEvidencePackage = (pkg: EvidencePackage) => {
    const updated = evidencePackages.map(p => p.id === pkg.id ? pkg : p);
    setEvidencePackages(updated);
    saveEvidencePackages(updated);
  };

  // Delete evidence package
  const handleDeleteEvidencePackage = (id: string) => {
    const updated = deleteEvidencePackage(id);
    setEvidencePackages(updated);
  };

  // Reset demo dataset
  const handleResetDemoData = async () => {
    clearDemoDataAndReset();
    setField(INITIAL_FIELD);
    setObservations(INITIAL_OBSERVATIONS);
    setInterventions(INITIAL_INTERVENTIONS);
    const initialPkg = await createInitialEvidencePackage();
    setEvidencePackages([initialPkg]);
  };

  // Effective online status considering demo simulation
  const effectiveOnline = isOnline && !isSimulatedOffline;

  return (
    <div className="min-h-screen bg-[#EAE4D5] flex justify-center text-[#1A221D] font-sans antialiased">
      {/* 1.2s Splash Screen on initial launch */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Main Container: Mobile Frame on wide screens, full-width on mobile */}
      <div className="w-full max-w-md min-h-screen bg-[#FBF9F4] shadow-2xl flex flex-col relative overflow-x-hidden">
        
        {/* Offline Notification Pill */}
        {!effectiveOnline && (
          <div className="bg-[#FFF3E0] text-[#E65100] px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-[#FFE0B2] z-40">
            <div className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE · Stored on device · Sync pending</span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase bg-white/60 px-1.5 py-0.5 rounded">
              LOCAL
            </span>
          </div>
        )}

        {/* Kshetra Office View vs Field App View */}
        {viewMode === 'office' ? (
          <OfficeScreen
            field={field}
            observations={observations}
            evidencePackages={evidencePackages}
            onBackToFieldApp={() => setViewMode('field')}
            language={language}
          />
        ) : (
          <>
            {/* Header */}
            {activeTab !== 'scan' && (
              <Header
                language={language}
                onLanguageChange={setLanguage}
                isOnline={isOnline}
                isSimulatedOffline={isSimulatedOffline}
                onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
                viewMode={viewMode}
                onToggleViewMode={() => setViewMode('office')}
              />
            )}

            {/* Screens Area */}
            <main className="flex-1">
              {activeTab === 'home' && (
                <HomeScreen
                  field={field}
                  observations={observations}
                  onUpdateField={handleUpdateField}
                  onNavigate={setActiveTab}
                  language={language}
                />
              )}

              {activeTab === 'scan' && (
                <ScanScreen
                  field={field}
                  onAddObservation={handleAddObservation}
                  onRecordInterventionPrompt={() => setActiveTab('passport')}
                  onBack={() => setActiveTab('home')}
                  language={language}
                  isOnline={effectiveOnline}
                />
              )}

              {activeTab === 'passport' && (
                <PassportScreen
                  field={field}
                  observations={observations}
                  interventions={interventions}
                  onDeleteObservation={handleDeleteObservation}
                  onDeleteIntervention={handleDeleteIntervention}
                  onAddIntervention={handleAddIntervention}
                  onNavigateToScan={() => setActiveTab('scan')}
                  language={language}
                />
              )}

              {activeTab === 'evidence' && (
                <EvidenceScreen
                  field={field}
                  evidencePackages={evidencePackages}
                  onSaveEvidencePackage={handleSaveEvidencePackage}
                  onUpdateEvidencePackage={handleUpdateEvidencePackage}
                  onDeleteEvidencePackage={handleDeleteEvidencePackage}
                  language={language}
                />
              )}

              {activeTab === 'more' && (
                <MoreScreen
                  language={language}
                  onLanguageChange={setLanguage}
                  isOnline={isOnline}
                  isSimulatedOffline={isSimulatedOffline}
                  onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
                  onResetDemoData={handleResetDemoData}
                  onOpenOffice={() => setViewMode('office')}
                />
              )}
            </main>

            {/* Bottom Navigation */}
            {activeTab !== 'scan' && (
              <BottomNav
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                language={language}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
