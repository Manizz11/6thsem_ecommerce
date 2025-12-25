import { useState } from "react";
import { CreditCard, Smartphone, Wallet, Building } from "lucide-react";

const PaymentGateways = ({ onPaymentMethodSelect, selectedMethod }) => {
  const paymentMethods = [
    {
      id: "esewa",
      name: "eSewa",
      icon: Wallet,
      description: "Digital wallet payment",
      color: "bg-green-600"
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: Smartphone,
      description: "Mobile payment solution",
      color: "bg-purple-600"
    },
    {
      id: "ime_pay",
      name: "IME Pay",
      icon: Building,
      description: "Bank transfer & mobile banking",
      color: "bg-red-600"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onPaymentMethodSelect(method.id)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedMethod === method.id
                  ? `border-primary ${method.color} text-white`
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-medium">{method.name}</div>
                  <div className={`text-sm ${
                    selectedMethod === method.id ? "text-gray-200" : "text-gray-500"
                  }`}>
                    {method.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentGateways;