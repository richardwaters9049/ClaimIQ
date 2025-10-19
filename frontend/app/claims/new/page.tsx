"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, Variants } from "framer-motion";

export default function NewClaimPage() {
  const [formData, setFormData] = useState({
    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    insuranceType: "",
    policyNumber: "",
    incidentDate: "",
    claimAmount: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated API call (replace with real endpoint)
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Auto-reset form after a short delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          claimantName: "",
          claimantEmail: "",
          claimantPhone: "",
          insuranceType: "",
          policyNumber: "",
          incidentDate: "",
          claimAmount: "",
          description: "",
        });
      }, 2000);
    }, 1000);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  } as const;

  const successVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
  } as const;

  return (
    <motion.div
      className="space-y-6 px-2 sm:px-4 md:px-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/claims" aria-label="Go back to claims list">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Claim</h1>
          <p className="text-muted-foreground">Submit a new insurance claim</p>
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        {isSubmitted ? (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-center"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            role="status"
            aria-live="polite"
          >
            <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Claim Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your claim has been received and is being processed.
            </p>
            <Link href="/claims">
              <Button>Return to Claims</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Claimant Info */}
            <motion.section className="space-y-4" variants={itemVariants}>
              <h2 className="text-lg font-medium">Claimant Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="claimantName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="claimantName"
                    name="claimantName"
                    value={formData.claimantName}
                    onChange={handleChange}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="claimantEmail" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="claimantEmail"
                    name="claimantEmail"
                    type="email"
                    value={formData.claimantEmail}
                    onChange={handleChange}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label htmlFor="claimantPhone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="claimantPhone"
                    name="claimantPhone"
                    value={formData.claimantPhone}
                    onChange={handleChange}
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </motion.section>

            {/* Claim Details */}
            <motion.section className="space-y-4" variants={itemVariants}>
              <h2 className="text-lg font-medium">Claim Details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="insuranceType" className="text-sm font-medium">
                    Insurance Type
                  </label>
                  <Select
                    onValueChange={(value) => handleSelectChange("insuranceType", value)}
                    value={formData.insuranceType}
                  >
                    <SelectTrigger id="insuranceType">
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto Insurance</SelectItem>
                      <SelectItem value="home">Home Insurance</SelectItem>
                      <SelectItem value="health">Health Insurance</SelectItem>
                      <SelectItem value="life">Life Insurance</SelectItem>
                      <SelectItem value="business">Business Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="policyNumber" className="text-sm font-medium">
                    Policy Number
                  </label>
                  <Input
                    id="policyNumber"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="incidentDate" className="text-sm font-medium">
                    Incident Date
                  </label>
                  <Input
                    id="incidentDate"
                    name="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="claimAmount" className="text-sm font-medium">
                    Claim Amount ($)
                  </label>
                  <Input
                    id="claimAmount"
                    name="claimAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.claimAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Incident Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="min-h-[120px]"
                />
              </div>
            </motion.section>

            {/* Submit */}
            <motion.div className="flex justify-end" variants={itemVariants}>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Submit Claim"
                )}
              </Button>
            </motion.div>
          </motion.form>
        )}
      </Card>
    </motion.div>
  );
}
