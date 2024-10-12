export interface IProfileBalance {
  pendingPoints: number;
  balance: number;
  lockedPoints: number;
  availablePoints: number;
  totalPoints: number;
}

export interface IMember {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: any;
  createdBy?: any;
  updatedBy: string;
  deletedBy?: any;
  id: string;
  memberCode: string;
  gender?: any;
  age?: any;
  pin?: any;
  passportNumber?: any;
  creditCardNumber?: any;
  dateOfBirth: Date;
  memberName: string;
  salutation?: any;
  middleName?: any;
  addressLine1?: any;
  addressLine2?: any;
  enrollmentTouchPoint?: any;
  enrollingSponsor?: any;
  userId: string;
  citizenIdentityCard?: any;
  passportExpireDate?: any;
  citizenIdentityCardExpireDate?: any;
  country?: any;
  referralCode: string;
  referralBy?: any;
  referralAt?: any;
  dinarMemberId?: any;
  dinarAccountId?: any;
  ekycStatus: string;
  canEditProfile: boolean;
  syncStatus: string;
  skyPlus: string;
  oldRankSkyPlus: number;
}

export interface ITierRemaining {
  nextTier: number;
}

export interface ITier {
  remaining: ITierRemaining;
  percent: number;
  tierClass: string;
  isValidTier: boolean;
  tierTitle: string;
  tierTitleEn: string;
  color: string;
  progressBarColor: string;
  homeBgColor: string;
  homeColor: string;
  homeBackgroundImg?: any;
  fromBgColor: string;
  toBgColor: string;
  fromBgDirection: string;
  toBgDirection: string;
  backgroundImg?: any;
  rank: number;
  icon: string;
}

export interface IBalance {
  balance: number;
}

export interface IHDBMemberProfile {
  hdBankMemberID?: string;
  memberCode?: string;
  loyID?: string;
}

export interface IUserProfile {
  createdAt: any;
  updatedAt: any;
  deletedAt: any;
  createdBy: any;
  updatedBy: any;
  deletedBy: any;
  id: any;
  fullName: any;
  email: any;
  phone: any;
  username: any;
  guid: any;
  isAdmin: any;
  status: any;
  deviceToken: any;
  state: any;
  canViewApiDetails: any;
  type: any;
  gid: any;
  termAndConditionDate: any;
  languageSetting: any;
  avatar: any;
  externalId: any;
  externalSrc: any;
  firstName: any;
  lastName: any;
  nationalNumber: any;
  countryCallingCode: any;
  country: any;
  member: IMember;
  tier: ITier;
  balance: IBalance;
  userGroups: any[];
}

export const STATUS_EKYC = {
  COMPLETE: 'COMPLETE',
  VERIFIED: 'VERIFIED'
};

export const ERROR_CONDITION = {
  EKYC: 'EKYC',
  BALANCE: 'BALANCE',
  SUSPECTED_FRAUD: 'SUSPECTED_FRAUD',
  NO_EKYC_AND_SUSPECTED_FRAUD: 'NO_EKYC_AND_SUSPECTED_FRAUD'
};

export const STATUS_PROFILE: any = {
  SUSPECTED_FRAUD: 'SUSPECTED_FRAUD',
  BLOCKED: 'BLOCKED',
  ACCOUNT_IS_CLOSED: 'ACCOUNT_IS_CLOSED'
};

export interface IProfileQueryParams {
  phone?: string;
  dateOfBirth?: string;
  fullName?: string;
  memberCode?: string;
  externalId?: string;
}
