import { useEffect, useState } from 'react';
import { Briefcase, Home, Laptop, MessageCircle, PhoneCall } from 'lucide-react';
import { CustomerBookingFlow } from './components/CustomerBookingFlow';
import { DriverJoinForm } from './components/DriverJoinForm';
import { AdminPanel } from './components/AdminPanel';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { usePWAInstall } from './hooks/usePWAInstall';
import type { PaymentSettings } from './types';

type AppTab = 'customer' | 'driver' | 'admin';

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  upiId: 'jitendradogra.hcl-1@oksbi',
  qrImageDataUrl: '',
  nriPaymentLink: '',
  adminWhatsapp: '918847662660',
  nightCharge: 150,
  firstBookingOfferEnabled: true,
  firstBookingDiscountAmount: 15,
  updatedAt: new Date().toISOString(),
};

function getInitialRouteState(): { tab: AppTab; driverSubTab: 'register' | 'duty'; driverPhone: string } {
  try {
    const params = new URLSearchParams(window.location.search);
    const joinParam = params.get('join');
    const tabParam = params.get('tab');
    const subParam = params.get('sub');
    const phoneParam = params.get('phone') || '';
    const isDriverRoute = joinParam === 'driver' || tabParam === 'driver';
    return {
      tab: isDriverRoute ? 'driver' : tabParam === 'admin' ? 'admin' : 'customer',
      driverSubTab: subParam === 'duty' ? 'duty' : 'register',
      driverPhone: phoneParam,
    };
  } catch {
    return { tab: 'customer', driverSubTab: 'register', driverPhone: '' };
  }
}

export default function App() {
  const initialRoute = getInitialRouteState();
  const [activeTab, setActiveTab] = useState<AppTab>(initialRoute.tab);
  const [driverSubTab, setDriverSubTab] = useState<'register' | 'duty'>(initialRoute.driverSubTab);
  const [driverInitialPhone] = useState<string>(initialRoute.driverPhone);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(true);
  const { isInstalled } = usePWAInstall();
  const pwaBannerActive = showInstallBanner && !isInstalled;

  useEffect(() => {
    fetch('/api/bootstrap')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.paymentSettings) {
          setPaymentSettings(data.paymentSettings);
        }
      })
      .catch(() => {
        // Keep defaults if offline
      });
  }, []);

  const switchTab = (tab: AppTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWaDigits = (paymentSettings.adminWhatsapp || '918847662660').replace(/\D/g, '');
  const displayPhone =
    cleanWaDigits.startsWith('91') && cleanWaDigits.length === 12
      ? `+91 ${cleanWaDigits.slice(2)}`
      : `+${cleanWaDigits}`;
  const waHelpHref = `https://wa.me/${cleanWaDigits}`;
  const telHref = `tel:+${cleanWaDigits}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-24 md:pb-12">
      {/* 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-6">
          {/* Zone 1: Brand Title + Clean Tagline */}
          <button
            type="button"
            onClick={() => switchTab('customer')}
            className="flex flex-col items-start text-left shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-none whitespace-nowrap">
              🇮🇳 SEVASATHI26
            </span>
            <span className="mt-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700 leading-none whitespace-nowrap">
              Proudly Serving India 🇮🇳
            </span>
          </button>

          {/* Zone 2: Clean Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
            <button
              type="button"
              onClick={() => switchTab('customer')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'customer'
                  ? 'border-emerald-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Seva Book Karein
            </button>
            <button
              type="button"
              onClick={() => switchTab('driver')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'driver'
                  ? 'border-emerald-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              👷 Driver / Staff Portal
            </button>
            <button
              type="button"
              onClick={() => switchTab('admin')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'admin'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Admin Panel
            </button>
          </nav>

          {/* Zone 3: Primary WhatsApp Help Action */}
          <div className="shrink-0">
            <a
              href={waHelpHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-emerald-600 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0"
            >
              <PhoneCall className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono">{displayPhone}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'customer' && (
          <CustomerBookingFlow
            paymentSettings={paymentSettings}
            onBookingCreated={() => {
              // Persisted on server; Admin panel fetches latest on open/refresh
            }}
          />
        )}

        {activeTab === 'driver' && (
          <DriverJoinForm
            paymentSettings={paymentSettings}
            activeSubTab={driverSubTab}
            onSubTabChange={setDriverSubTab}
            initialPhone={driverInitialPhone}
            onDriverSubmitted={() => {
              // Persisted on server for immediate Admin review
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            paymentSettings={paymentSettings}
            onPaymentSettingsUpdated={(next) => setPaymentSettings(next)}
          />
        )}
      </main>

      {/* Floating Help / Call Button */}
      <div
        className={`fixed right-4 z-30 flex items-center gap-2 transition-all ${
          pwaBannerActive ? 'bottom-[136px] md:bottom-6' : 'bottom-20 md:bottom-6'
        }`}
      >
        <a
          href={telHref}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 shadow-lg hover:bg-slate-50 transition-transform active:scale-95 whitespace-nowrap"
          aria-label={`Call Help ${displayPhone}`}
        >
          <PhoneCall className="h-4 w-4 text-emerald-700 shrink-0" />
          <span className="font-mono">Call {displayPhone}</span>
        </a>
        <a
          href={waHelpHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 transition-transform active:scale-95 whitespace-nowrap"
          aria-label={`WhatsApp Help ${displayPhone}`}
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span>WhatsApp Help</span>
        </a>
      </div>

      {/* Friendly Mobile App Install Popup (PWA) */}
      <PWAInstallBanner visible={showInstallBanner} onDismiss={() => setShowInstallBanner(false)} />

      {/* Mobile Fixed Bottom Thumb Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-slate-200 bg-white/95 backdrop-blur-md grid grid-cols-3 items-center"
      >
        <button
          type="button"
          onClick={() => switchTab('customer')}
          className={`flex flex-col items-center justify-center min-h-[48px] text-[11px] font-bold transition-colors ${
            activeTab === 'customer' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span className="whitespace-nowrap">Seva Book</span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('driver')}
          className={`flex flex-col items-center justify-center min-h-[48px] text-[11px] font-bold transition-colors ${
            activeTab === 'driver' ? 'text-amber-700' : 'text-slate-500'
          }`}
        >
          <Briefcase className="h-5 w-5 mb-0.5" />
          <span className="whitespace-nowrap">Driver Portal</span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('admin')}
          className={`flex flex-col items-center justify-center min-h-[48px] text-[11px] font-bold transition-colors ${
            activeTab === 'admin' ? 'text-slate-900' : 'text-slate-500'
          }`}
        >
          <Laptop className="h-5 w-5 mb-0.5" />
          <span className="whitespace-nowrap">Admin (PIN)</span>
        </button>
      </nav>
    </div>
  );
}
