import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useNavigation } from "expo-router";

export interface UseUniversalDraftGuardOptions {
  /** Return true if the user has unsaved input/dirty state that should trigger draft confirmation */
  isDirty: () => boolean;
  /** Callback executed when user chooses "Save as Draft & Exit" */
  onSaveDraft: () => void;
  /** Callback executed when user chooses "Discard & Exit" */
  onDiscardDraft: () => void;
  /** Return true if screen is in final success/completed state where user can navigate away freely */
  isSubmitted?: () => boolean;
}

export const useUniversalDraftGuard = ({
  isDirty,
  onSaveDraft,
  onDiscardDraft,
  isSubmitted = () => false,
}: UseUniversalDraftGuardOptions) => {
  const router = useRouter();
  const navigation = useNavigation();

  const [showDraftModal, setShowDraftModal] = useState(false);
  const pendingNavigationActionRef = useRef<any>(null);
  const hasSubmittedRef = useRef(false);

  // Keep refs in sync with callbacks
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  const isSubmittedRef = useRef(isSubmitted);
  isSubmittedRef.current = isSubmitted;

  const onSaveDraftRef = useRef(onSaveDraft);
  onSaveDraftRef.current = onSaveDraft;

  const onDiscardDraftRef = useRef(onDiscardDraft);
  onDiscardDraftRef.current = onDiscardDraft;

  const markSubmitted = useCallback(() => {
    hasSubmittedRef.current = true;
  }, []);

  useEffect(() => {
    const unsubscribe = (navigation as any).addListener("beforeRemove", (e: any) => {
      // If already submitted or final step reached, allow free navigation
      if (hasSubmittedRef.current || isSubmittedRef.current()) {
        return;
      }

      // Check if user has entered data
      if (!isDirtyRef.current()) {
        return;
      }

      // Intercept navigation & open draft modal
      e.preventDefault();
      pendingNavigationActionRef.current = e.data.action;
      setShowDraftModal(true);
    });

    return unsubscribe;
  }, [navigation]);

  const handleSaveAndExit = useCallback(() => {
    onSaveDraftRef.current();
    setShowDraftModal(false);
    hasSubmittedRef.current = true;

    if (pendingNavigationActionRef.current) {
      navigation.dispatch(pendingNavigationActionRef.current);
    } else {
      router.back();
    }
  }, [navigation, router]);

  const handleDiscardAndExit = useCallback(() => {
    onDiscardDraftRef.current();
    setShowDraftModal(false);
    hasSubmittedRef.current = true;

    if (pendingNavigationActionRef.current) {
      navigation.dispatch(pendingNavigationActionRef.current);
    } else {
      router.back();
    }
  }, [navigation, router]);

  const handleCancel = useCallback(() => {
    setShowDraftModal(false);
    pendingNavigationActionRef.current = null;
  }, []);

  const openDraftModal = useCallback(() => {
    setShowDraftModal(true);
  }, []);

  return {
    showDraftModal,
    openDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  };
};
