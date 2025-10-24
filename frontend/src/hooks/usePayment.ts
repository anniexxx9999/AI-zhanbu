'use client';

import { useState, useEffect } from 'react';

export type PlanType = 'free' | 'professional' | 'premium';

export interface PaymentState {
  currentPlan: PlanType;
  isSubscribed: boolean;
  subscriptionEndDate: Date | null;
  isTrialActive: boolean;
  trialDaysRemaining: number;
}

export const usePayment = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    currentPlan: 'free',
    isSubscribed: false,
    subscriptionEndDate: null,
    isTrialActive: false,
    trialDaysRemaining: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从localStorage或API获取用户订阅状态
    const loadPaymentState = () => {
      try {
        const stored = localStorage.getItem('paymentState');
        if (stored) {
          const parsed = JSON.parse(stored);
          setPaymentState({
            ...parsed,
            subscriptionEndDate: parsed.subscriptionEndDate ? new Date(parsed.subscriptionEndDate) : null
          });
        }
      } catch (error) {
        console.error('Error loading payment state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentState();
  }, []);

  const updatePaymentState = (newState: Partial<PaymentState>) => {
    const updatedState = { ...paymentState, ...newState };
    setPaymentState(updatedState);
    localStorage.setItem('paymentState', JSON.stringify(updatedState));
  };

  const upgradePlan = (newPlan: PlanType) => {
    updatePaymentState({
      currentPlan: newPlan,
      isSubscribed: true,
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
      isTrialActive: false,
      trialDaysRemaining: 0
    });
  };

  const startTrial = () => {
    updatePaymentState({
      currentPlan: 'professional',
      isSubscribed: false,
      subscriptionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天试用
      isTrialActive: true,
      trialDaysRemaining: 7
    });
  };

  const hasAccess = (feature: string): boolean => {
    if (paymentState.currentPlan === 'free') {
      return ['basic_chart', 'sun_sign', 'basic_analysis'].includes(feature);
    }
    
    if (paymentState.currentPlan === 'professional') {
      return [
        'basic_chart', 'sun_sign', 'basic_analysis',
        'full_houses', 'detailed_analysis', 'marriage_matching',
        'career_guidance', 'health_insights', 'pdf_reports'
      ].includes(feature);
    }
    
    if (paymentState.currentPlan === 'premium') {
      return true; // 至尊版拥有所有功能
    }
    
    return false;
  };

  const isFeatureLocked = (feature: string): boolean => {
    return !hasAccess(feature);
  };

  const getUpgradeMessage = (feature: string): string => {
    if (feature === 'full_houses') {
      return '升级至专业版解锁完整12宫位分析';
    }
    if (feature === 'detailed_analysis') {
      return '升级至专业版获得详细占星解读';
    }
    if (feature === 'marriage_matching') {
      return '升级至专业版解锁灵魂伴侣匹配';
    }
    if (feature === 'expert_consultation') {
      return '升级至至尊版获得专家一对一解读';
    }
    return '升级解锁更多功能';
  };

  return {
    paymentState,
    isLoading,
    hasAccess,
    isFeatureLocked,
    getUpgradeMessage,
    upgradePlan,
    startTrial,
    updatePaymentState
  };
};
