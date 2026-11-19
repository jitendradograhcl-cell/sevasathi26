export type ServiceId =
  | 'bike_runner'
  | 'auto_hospital'
  | 'car_hospital'
  | 'car_driver'
  | 'medical_stretcher'
  | 'factory_inspection';

export type PricingMode = 'distance_km' | 'hours' | 'visit';

export interface ServiceDef {
  id: ServiceId;
  emoji: string;
  title: string;
  hinglishShort: string;
  priceLabel: string;
  description: string;
  pricingMode: PricingMode;
  basePrice: number;
  unitPrice: number;
  unitLabel: string;
  defaultQty: number;
  minQty: number;
  maxQty: number;
  staffBaseShare: number;
  staffUnitShare: number;
  driverPayoutLabel: string;
  adminBaseProfit: number;
  adminUnitProfit: number;
  accentHex: string;
  tintBgClass: string;
}

export type PaymentMode = 'Razorpay Live Checkout (UPI / Card)';

export type BookingStatus = 'pending' | 'dispatched' | 'completed' | 'cancelled';

export type CustomerConfirmationStatus = 'waiting' | 'confirmed' | 'cancelled';

export interface AutomationPipelineLog {
  mode: 'api_webhook' | 'instant_direct';
  stepAStatus: string;
  stepBStatus: string;
  stepCStatus: string;
  dispatchedDriverName?: string;
  dispatchedDriverPhone?: string;
  triggeredAt: string;
}

export interface AutomationSettings {
  fast2smsApiKey: string;
  ivrWebhookUrl: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  serviceId: ServiceId;
  serviceTitle: string;
  quantity: number;
  unitLabel: string;
  nightCharge: number;
  discountAmount: number;
  totalPrice: number;
  staffShare: number;
  adminProfit: number;
  customerName: string;
  customerPhone: string;
  areaOrAddress: string;
  gpsLink: string;
  otp: string;
  paymentMode: PaymentMode;
  razorpayPaymentId?: string;
  paymentStatus?: string;
  patientGender?: 'Male / General' | 'Female Patient';
  femaleCareAssistant?: 'Female Staff Nurse' | '1st-Year Female Student' | 'Female Apprentice';
  status: BookingStatus;
  customerConfirmationStatus?: CustomerConfirmationStatus;
  customerConfirmationUpdatedAt?: string;
  automationLog?: AutomationPipelineLog;
  settlementStatus?: 'unsettled' | 'settled';
  settledAt?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  completedAt?: string;
  createdAt: string;
}

export type DriverRole =
  | 'Bike Rider'
  | 'Auto Helper'
  | 'Car Driver'
  | 'Medical Stretcher Team'
  | 'Inspector';

export type DriverStatus = 'pending' | 'approved' | 'rejected';

export interface LicenseAiCheckResult {
  passed: boolean;
  isRealLicensePhoto: boolean;
  isRealAadhaarPhoto?: boolean;
  dlFormatValid: boolean;
  isAtLeastOneYearOld: boolean;
  namesMatched: boolean;
  extractedAadhaarName: string;
  extractedDlName: string;
  extractedDlNumber: string;
  extractedIssueDate: string;
  reasonHinglish: string;
  checkedAt: string;
}

export interface DriverApplication {
  id: string;
  fullName: string;
  mobile: string;
  role: DriverRole;
  areaCity: string;
  aadhaarNumber?: string;
  dlNumber: string;
  dlIssueDate: string;
  dlPhotoDataUrl: string;
  dlBackPhotoDataUrl?: string;
  aadhaarPhotoDataUrl: string;
  aadhaarBackPhotoDataUrl?: string;
  qualificationConfirmed?: boolean;
  marksheet12thDataUrl?: string;
  marksheet12thFileName?: string;
  selfieDataUrl: string;
  aiCheck: LicenseAiCheckResult;
  status: DriverStatus;
  createdAt: string;
}

export interface PaymentSettings {
  upiId: string;
  qrImageDataUrl: string;
  nriPaymentLink: string;
  adminWhatsapp: string;
  nightCharge: number;
  firstBookingOfferEnabled: boolean;
  firstBookingDiscountAmount: number;
  updatedAt: string;
}
