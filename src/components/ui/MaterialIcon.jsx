function MaterialIcon({ children, name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {children ?? name}
    </span>
  )
}

export default MaterialIcon
