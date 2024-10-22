import { TransactionModal } from '#components';

export function useTransactionModal({
  title,
  steps,
  token,
  onClose,
}: {
  title?: string;
  steps?: ('approve' | 'send')[];
  token?: { icon?: string; address: string; symbol: string };
  onClose?: (closed: boolean) => void;
} = {}) {
  const modal = useModal();
  const open = () => {
    modal.open(TransactionModal, {
      title,
      steps: steps || ['send'],
      status: steps?.[0] ?? 'send'!,
      token,
      onClose: () => {
        onClose?.(true);
      },
    });
  };

  const setStep = (step: 'approve' | 'send') => {
    modal.patch<typeof TransactionModal>({
      status: step,
    });
  };

  const success = (transactionUrl: string) => {
    modal.patch<typeof TransactionModal>({
      status: 'success',
      transactionUrl,
    });
  };
  open();

  return {
    open, setStep, success, close: modal.close,
  };
}
