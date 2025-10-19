"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  PlusCircleIcon,
  SearchIcon,
  FilterIcon,
  ArrowUpDownIcon,
  ChevronRightIcon
} from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
} as const;

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
} as const;

// --- Component ---
export default function ClaimsPage() {
  // Mock data for claims
  const claims = [
    { id: "CL-2023-0042", type: "Auto Insurance", status: "Approved", amount: "$1,250.00", date: "2023-06-15", claimant: "John Smith" },
    { id: "CL-2023-0041", type: "Home Insurance", status: "Pending", amount: "$3,750.00", date: "2023-06-14", claimant: "Sarah Johnson" },
    { id: "CL-2023-0040", type: "Health Insurance", status: "Rejected", amount: "$850.00", date: "2023-06-12", claimant: "Michael Brown" },
    { id: "CL-2023-0039", type: "Auto Insurance", status: "Approved", amount: "$2,100.00", date: "2023-06-10", claimant: "Emily Davis" },
    { id: "CL-2023-0038", type: "Life Insurance", status: "Pending", amount: "$10,000.00", date: "2023-06-08", claimant: "Robert Wilson" },
    { id: "CL-2023-0037", type: "Home Insurance", status: "Approved", amount: "$5,200.00", date: "2023-06-05", claimant: "Jennifer Lee" },
    { id: "CL-2023-0036", type: "Health Insurance", status: "Pending", amount: "$1,800.00", date: "2023-06-03", claimant: "David Miller" },
    { id: "CL-2023-0035", type: "Auto Insurance", status: "Rejected", amount: "$3,400.00", date: "2023-06-01", claimant: "Lisa Anderson" }
  ];

  return (
    <motion.div
      className="space-y-6 px-2 sm:px-4 md:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Claims</h1>
          <p className="text-muted-foreground">Manage and track all insurance claims</p>
        </div>
        <Link href="/claims/new">
          <Button className="w-full sm:w-auto">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </Link>
      </motion.div>

      {/* Claims Table */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          {/* Search + Filter */}
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b gap-4">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search claims..."
                className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <ArrowUpDownIcon className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Claimant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim, index) => (
                  <motion.tr
                    key={claim.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    className="border-b transition-all hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.claimant}</TableCell>
                    <TableCell>{claim.type}</TableCell>
                    <TableCell>{claim.amount}</TableCell>
                    <TableCell>{claim.date}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${claim.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : claim.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {claim.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/claims/${claim.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            {claims.map((claim, index) => (
              <motion.div
                key={claim.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{claim.id}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${claim.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : claim.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {claim.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Claimant</p>
                    <p>{claim.claimant}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p>{claim.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p>{claim.amount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{claim.date}</p>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <Link href={`/claims/${claim.id}`}>
                    <Button variant="ghost" size="sm" className="flex items-center">
                      View Details
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
