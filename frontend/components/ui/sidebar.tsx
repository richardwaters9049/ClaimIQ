"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  HomeIcon, 
  FileTextIcon, 
  PlusCircleIcon, 
  BarChartIcon, 
  SettingsIcon, 
  HelpCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "../../hooks/use-media-query"


export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [mobileOpen, setMobileOpen] = React.useState(false)
  
  // Auto-collapse on mobile
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon
    },
    {
      name: "Claims",
      href: "/claims",
      icon: FileTextIcon
    },
    {
      name: "New Claim",
      href: "/claims/new",
      icon: PlusCircleIcon
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChartIcon
    },
    {
      name: "Settings",
      href: "/settings",
      icon: SettingsIcon
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircleIcon
    }
  ]
  
  // Mobile menu button for small screens
  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-50"
      onClick={() => setMobileOpen(!mobileOpen)}
    >
      <MenuIcon className="h-5 w-5" />
    </Button>
  )
  
  return (
    <>
      <MobileMenuButton />
      
      <AnimatePresence>
        {(mobileOpen || !isMobile) && (
          <motion.div
            initial={{ x: isMobile ? -320 : 0 }}
            animate={{ 
              x: 0,
              width: collapsed && !isMobile ? 80 : 256
            }}
            exit={{ x: -320 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            className={cn(
              "h-full bg-white border-r border-gray-200 flex flex-col",
              isMobile ? "fixed z-40 shadow-xl" : "relative",
              collapsed && !isMobile ? "w-20" : "w-64"
            )}
          >
            <div className={cn(
              "p-4 flex items-center",
              collapsed && !isMobile ? "justify-center" : "justify-between"
            )}>
              {(!collapsed || isMobile) && (
                <div>
                  <h2 className="text-2xl font-bold text-blue-600">ClaimIQ</h2>
                  <p className="text-sm text-gray-500">AI Claims Processing</p>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className={isMobile ? "ml-auto" : ""}
              >
                {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
              </Button>
            </div>
            
            <Separator />
            
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={item.href} onClick={() => isMobile && setMobileOpen(false)}>
                              <Button 
                                variant={isActive ? "default" : "ghost"} 
                                className={cn(
                                  "w-full",
                                  collapsed && !isMobile ? "justify-center px-2" : "justify-start",
                                  isActive ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : ""
                                )}
                              >
                                <item.icon className={cn(
                                  "h-5 w-5",
                                  collapsed && !isMobile ? "mr-0" : "mr-2"
                                )} />
                                {(!collapsed || isMobile) && item.name}
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          {collapsed && !isMobile && (
                            <TooltipContent side="right">
                              {item.name}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </li>
                  )
                })}
              </ul>
            </nav>
            
            <div className={cn(
              "p-4 mt-auto",
              collapsed && !isMobile ? "flex justify-center" : ""
            )}>
              <Separator className="mb-4" />
              <div className={cn(
                "flex items-center",
                collapsed && !isMobile ? "justify-center" : ""
              )}>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  U
                </div>
                {(!collapsed || isMobile) && (
                  <div className="ml-2">
                    <p className="text-sm font-medium">User Name</p>
                    <p className="text-xs text-gray-500">user@example.com</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay for mobile */}
      {isMobile && mobileOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
