"use client";

import { useParams } from "next/navigation";
import PaymentSuccessComponent from "@/features/payments/components/PaymentSuccess";

const PaymentSuccessPage = () => {
  const { id } = useParams();
  const paymentId = Array.isArray(id) ? id[0] : id;

  return (
    <div>
      <PaymentSuccessComponent paymentId={paymentId} />
    </div>
  );
};

export default PaymentSuccessPage;
