import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={2000}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-toast/80 group-[.toaster]:border-none group-[.toaster]:text-foreground group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-toast-success/80 group-[.toaster]:text-white",
          error: "group-[.toaster]:bg-toast-destructive/80 group-[.toaster]:text-white",
          default: "group-[.toaster]:bg-toast/80 group-[.toaster]:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }