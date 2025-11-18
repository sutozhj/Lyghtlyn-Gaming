import React from 'react'
import { Button } from './button'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface AlertDialogContentProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogHeaderProps {
  children: React.ReactNode
}

interface AlertDialogFooterProps {
  children: React.ReactNode
}

interface AlertDialogTitleProps {
  children: React.ReactNode
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode
}

interface AlertDialogActionProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

interface AlertDialogCancelProps {
  children: React.ReactNode
  onClick?: () => void
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">
        {children}
      </div>
    </div>
  )
}

export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#1A1A2E]/95 border border-gray-700 rounded-lg shadow-xl p-6 max-w-lg w-full ${className}`}>
      {children}
    </div>
  )
}

export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ children }) => {
  return (
    <div className="mb-4">
      {children}
    </div>
  )
}

export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ children }) => {
  return (
    <div className="flex justify-end gap-2 mt-6">
      {children}
    </div>
  )
}

export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ children }) => {
  return (
    <h2 className="text-lg font-semibold text-white">
      {children}
    </h2>
  )
}

export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ children }) => {
  return (
    <p className="text-sm text-gray-400 mt-2">
      {children}
    </p>
  )
}

export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ children, onClick, className }) => {
  return (
    <Button onClick={onClick} className={className}>
      {children}
    </Button>
  )
}

export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ children, onClick }) => {
  return (
    <Button variant="outline" onClick={onClick}>
      {children}
    </Button>
  )
}

