import { useEffect, useState } from "react"

const SplashScreen = () => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 to-amber-700 transition-opacity duration-500">
      <div className="animate-in fade-in zoom-in duration-700">
        <img
          src="/icons/icon-192x192.png"
          alt="Logo Smoke & Grill"
          width={120}
          height={120}
          className="w-32 h-32 drop-shadow-2xl"
        />
      </div>

      <h1 className="mt-6 text-5xl font-bold text-white tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        Smoke & Grill
      </h1>

      <p className="mt-4 text-white/90 text-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        Cargando...
      </p>

      <div className="mt-6 flex gap-2 animate-in fade-in duration-700 delay-500">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

export default SplashScreen
