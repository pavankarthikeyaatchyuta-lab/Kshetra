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
import { Sidebar } from './components/navigation/Sidebar';
import { TopBar } from './components/navigation/TopBar';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter observations if user typed in search query
  const filteredObservations = searchQuery.trim()
    ? observations.filter(o => 
        o.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : observations;

  // Effective online status considering demo simulation
  const effectiveOnline = isOnline && !isSimulatedOffline;

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex text-[#1A221D] font-sans antialiased selection:bg-[#2E7D32]/20">
      {/* 1.2s Splash Screen on initial launch */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Desktop Left Sidebar (Visible on lg: and up) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'fields' || tab === 'insights') {
              setActiveTab('passport');
            } else {
              setActiveTab(tab);
            }
          }}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode(viewMode === 'office' ? 'field' : 'office')}
        />
      </div>

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#FBF9F4]">
        
        {/* Offline Notification Banner */}
        {!effectiveOnline && (
          <div className="bg-[#FFF3E0] text-[#E65100] px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-[#FFE0B2] z-40 sticky top-0">
            <div className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE · Stored on device · Sync pending</span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase bg-white/60 px-1.5 py-0.5 rounded">
              LOCAL
            </span>
          </div>
        )}

        {/* Desktop TopBar with Search, Online Status, Language, User Avatar */}
        <div className="hidden lg:block">
          <TopBar
            language={language}
            onLanguageChange={setLanguage}
            isOnline={isOnline}
            isSimulatedOffline={isSimulatedOffline}
            onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Mobile Header (Visible below lg:) */}
        <div className="block lg:hidden">
          {activeTab !== 'scan' && (
            <Header
              language={language}
              onLanguageChange={setLanguage}
              isOnline={isOnline}
              isSimulatedOffline={isSimulatedOffline}
              onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
              viewMode={viewMode}
              onToggleViewMode={() => setViewMode(viewMode === 'office' ? 'field' : 'office')}
            />
          )}
        </div>

        {/* View Mode Switching: Kshetra Office vs Field Experience */}
        {viewMode === 'office' ? (
          <OfficeScreen
            field={field}
            observations={observations}
            evidencePackages={evidencePackages}
            onBackToFieldApp={() => setViewMode('field')}
            language={language}
          />
        ) : (
          <main className="flex-1 overflow-x-hidden">
            {activeTab === 'home' && (
              <HomeScreen
                field={field}
                observations={filteredObservations}
                onUpdateField={handleUpdateField}
                onNavigate={setActiveTab}
                isOnline={effectiveOnline}
                onDeleteObservation={handleDeleteObservation}
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
                observations={filteredObservations}
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
        )}

        {/* Mobile Bottom Navigation (Visible on mobile/tablet below lg:) */}
        <div className="block lg:hidden">
          {activeTab !== 'scan' && viewMode === 'field' && (
            <BottomNav
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              language={language}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
