import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MortgageType = "repayment" | "interest-only";

interface CalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

interface FormErrors {
  loanAmount?: string;
  interestRate?: string;
  loanTerm?: string;
  mortgageType?: string;
}

export default function Index() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [mortgageType, setMortgageType] = useState<MortgageType>("repayment");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!loanAmount) {
      newErrors.loanAmount = "Loan amount is required";
    } else if (isNaN(Number(loanAmount)) || Number(loanAmount) <= 0) {
      newErrors.loanAmount = "Please enter a valid loan amount";
    }

    if (!interestRate) {
      newErrors.interestRate = "Interest rate is required";
    } else if (isNaN(Number(interestRate)) || Number(interestRate) < 0) {
      newErrors.interestRate = "Please enter a valid interest rate";
    }

    if (!loanTerm) {
      newErrors.loanTerm = "Loan term is required";
    } else if (
      isNaN(Number(loanTerm)) ||
      Number(loanTerm) <= 0 ||
      !Number.isInteger(Number(loanTerm))
    ) {
      newErrors.loanTerm = "Please enter a valid loan term in years";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateMortgage = () => {
    if (!validateForm()) {
      setSubmitted(true);
      return;
    }

    setSubmitted(true);

    const principal = Number(loanAmount);
    const annualRate = Number(interestRate);
    const years = Number(loanTerm);
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (mortgageType === "repayment") {
      if (monthlyRate === 0) {
        monthlyPayment = principal / numberOfPayments;
      } else {
        monthlyPayment =
          (principal *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
      totalPayment = monthlyPayment * numberOfPayments;
      totalInterest = totalPayment - principal;
    } else {
      monthlyPayment = principal * monthlyRate;
      totalPayment = principal + monthlyPayment * numberOfPayments;
      totalInterest = monthlyPayment * numberOfPayments;
    }

    setResult({
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    });
  };

  const handleReset = () => {
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("");
    setMortgageType("repayment");
    setResult(null);
    setErrors({});
    setSubmitted(false);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Mortgage Calculator
          </h1>
          <p className="mt-2 text-gray-600">
            Calculate your monthly mortgage payments and total costs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Loan Details
            </h2>

            <div className="space-y-6">
              {/* Loan Amount */}
              <div className="space-y-2">
                <Label
                  htmlFor="loanAmount"
                  className="text-gray-700 font-medium"
                >
                  Loan Amount (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 font-medium">
                    $
                  </span>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="250000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="pl-7 text-base"
                  />
                </div>
                {submitted && errors.loanAmount && (
                  <p className="text-red-500 text-sm font-medium">
                    {errors.loanAmount}
                  </p>
                )}
              </div>

              {/* Interest Rate and Loan Term Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="interestRate"
                    className="text-gray-700 font-medium"
                  >
                    Annual Interest Rate (%)
                  </Label>
                  <div className="relative">
                    <Input
                      id="interestRate"
                      type="number"
                      placeholder="6.5"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="text-base"
                    />
                    <span className="absolute right-3 top-3 text-gray-500 font-medium">
                      %
                    </span>
                  </div>
                  {submitted && errors.interestRate && (
                    <p className="text-red-500 text-sm font-medium">
                      {errors.interestRate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanTerm" className="text-gray-700 font-medium">
                    Loan Term (Years)
                  </Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    placeholder="30"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="text-base"
                  />
                  {submitted && errors.loanTerm && (
                    <p className="text-red-500 text-sm font-medium">
                      {errors.loanTerm}
                    </p>
                  )}
                </div>
              </div>

              {/* Mortgage Type */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Mortgage Type
                </Label>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setMortgageType("repayment")}
                    className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                      mortgageType === "repayment"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Repayment
                  </Button>
                  <Button
                    onClick={() => setMortgageType("interest-only")}
                    className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                      mortgageType === "interest-only"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Interest Only
                  </Button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateMortgage}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all"
                >
                  Calculate
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Section */}
          <div className="lg:flex lg:flex-col lg:justify-start">
            {result ? (
              <Card className="p-6 sm:p-8 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Results
                </h2>

                <div className="space-y-6">
                  {/* Monthly Payment */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Monthly Payment
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                  </div>

                  {/* Total Payment */}
                  <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Total Amount Paid
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {formatCurrency(result.totalPayment)}
                    </p>
                  </div>

                  {/* Total Interest */}
                  <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Total Interest Paid
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-600">
                      {formatCurrency(result.totalInterest)}
                    </p>
                  </div>

                  {/* Summary Info */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(Number(loanAmount))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-semibold text-gray-900">
                        {Number(interestRate).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Term:</span>
                      <span className="font-semibold text-gray-900">
                        {loanTerm} years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mortgage Type:</span>
                      <span className="font-semibold text-gray-900 capitalize">
                        {mortgageType === "repayment"
                          ? "Repayment"
                          : "Interest Only"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 sm:p-8 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Fill in your loan details and click "Calculate" to see your
                    mortgage breakdown
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
