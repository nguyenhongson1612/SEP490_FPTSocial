import { useEffect, useRef } from 'react'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'

const InfiniteScroll = ({
  children,
  fetchMore,
  hasMore,
  endMessage,
  className
}) => {
  const pageEndRef = useRef(null)
  useEffect(() => {
    if (hasMore) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMore()
        }
      })

      if (pageEndRef.current) {
        observer.observe(pageEndRef.current)
      }

      return () => {
        if (pageEndRef.current) {
          observer.unobserve(pageEndRef.current)
        }
      }
    }
  }, [hasMore])
  return (
    <div className={className}>
      {children}
      {hasMore ? <div ref={pageEndRef}><PageLoadingSpinner /></div> : endMessage}
    </div>
  )
}

export default InfiniteScroll

