export default function CornerBrackets() {
  return (
    <>
      <svg className="absolute top-2 left-2 w-5 h-5 text-blue-400/60 pointer-events-none" viewBox="0 0 24 24" fill="none">
        <path d="M2 10V4a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute top-2 right-2 w-5 h-5 text-blue-400/60 pointer-events-none" viewBox="0 0 24 24" fill="none">
        <path d="M22 10V4a2 2 0 0 0-2-2h-6" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-2 left-2 w-5 h-5 text-blue-400/60 pointer-events-none" viewBox="0 0 24 24" fill="none">
        <path d="M2 14v6a2 2 0 0 0 2 2h6" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-2 right-2 w-5 h-5 text-blue-400/60 pointer-events-none" viewBox="0 0 24 24" fill="none">
        <path d="M22 14v6a2 2 0 0 1-2 2h-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </>
  )
}