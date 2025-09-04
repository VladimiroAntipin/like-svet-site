'use client';
import { LoadingDots } from './ui/loading-dots';

interface AlfaBankButtonProps {
  isSubmitting: boolean;
  isCheckoutDisabled: boolean;
  onCheckout: () => void;
}

export default function AlfaBankButton({
  isSubmitting,
  isCheckoutDisabled,
  onCheckout,
}: AlfaBankButtonProps) {
  const disabled = isCheckoutDisabled || isSubmitting;

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={onCheckout}
        disabled={disabled}
        className={`w-full mt-2 rounded-none cursor-pointer flex justify-center items-center gap-2 px-6 py-3 transition-colors
          ${disabled
            ? 'bg-gray-400 cursor-auto text-gray-200'
            : 'bg-black text-white hover:bg-gray-900'}`}
      >
        {isSubmitting ? (
          <>
            <span>Оформление</span>
            <LoadingDots />
          </>
        ) : (
          'Оформить заказ'
        )}
      </button>
      <p className="text-sm mt-2 text-gray-500">
        Переход на защищённую страницу оплаты
      </p>
    </div>
  );
}

