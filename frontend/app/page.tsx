"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BarChartIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Dashboard() {
  // Mock data for the dashboard
  const stats = [
    { title: "Total Claims", value: "124", icon: FileTextIcon, color: "bg-blue-100 text-blue-700" },
    { title: "Approved", value: "78", icon: CheckCircleIcon, color: "bg-green-100 text-green-700" },
    { title: "Pending", value: "32", icon: ClockIcon, color: "bg-yellow-100 text-yellow-700" },
    { title: "Rejected", value: "14", icon: AlertCircleIcon, color: "bg-red-100 text-red-700" },
  ];

  const recentClaims = [
    { id: "CL-2023-0042", type: "Auto Insurance", status: "Approved", amount: "$1,250.00", date: "2023-06-15" },
    { id: "CL-2023-0041", type: "Home Insurance", status: "Pending", amount: "$3,750.00", date: "2023-06-14" },
    { id: "CL-2023-0040", type: "Health Insurance", status: "Rejected", amount: "$850.00", date: "2023-06-12" },
    { id: "CL-2023-0039", type: "Auto Insurance", status: "Approved", amount: "$2,100.00", date: "2023-06-10" },
  ];

  // Animation variants (now strongly typed)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  } as const;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your insurance claims</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
        variants={itemVariants}
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="p-4 h-full">
              <div className="flex items-center gap-4">
                <motion.div
                  className={`p-2 rounded-full ${stat.color}`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <stat.icon className="h-5 w-5" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <motion.h3
                    className="text-2xl font-bold"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                  </motion.h3>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts and Recent Claims */}
      <motion.div className="grid gap-4 md:grid-cols-2" variants={itemVariants}>
        {/* Processing Status */}
        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Processing Status</h3>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              {[
                { label: "Auto Insurance", value: 85 },
                { label: "Home Insurance", value: 65 },
                { label: "Health Insurance", value: 92 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="space-y-2"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}%</p>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.3 + i * 0.2, duration: 0.8 }}
                  >
                    <Progress value={item.value} className="h-2" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Claims */}
        <motion.div variants={itemVariants}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Recent Claims</h3>
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              {recentClaims.map((claim, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className="rounded-md p-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{claim.id}</p>
                      <p className="text-xs text-muted-foreground">{claim.type}</p>
                    </div>
                    <div className="text-right mt-1 sm:mt-0">
                      <p className="text-sm font-medium">{claim.amount}</p>
                      <p
                        className={`text-xs ${claim.status === "Approved"
                          ? "text-green-600"
                          : claim.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                          }`}
                      >
                        {claim.status}
                      </p>
                    </div>
                  </div>
                  {index < recentClaims.length - 1 && <Separator className="mt-2" />}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
