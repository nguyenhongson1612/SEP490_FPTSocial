import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

function PostContents({ postData, postType }) {
  const cleanHtml = DOMPurify.sanitize(postData?.content)
  const [isExpanded, setIsExpanded] = useState(false)
  const [truncatedHtml, setTruncatedHtml] = useState('')

  useEffect(() => {
    const truncateHtml = (html, maxLength) => {
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const body = doc.body

      let currentLength = 0
      let truncated = ''

      function traverse(node) {
        if (currentLength >= maxLength) return

        if (node.nodeType === Node.TEXT_NODE) {
          const remainingLength = maxLength - currentLength
          const text = node.textContent
          if (currentLength + text.length <= maxLength) {
            truncated += text
            currentLength += text.length
          } else {
            truncated += text.slice(0, remainingLength) + ' ... '
            currentLength = maxLength
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          truncated += `<${node.tagName.toLowerCase()}>`
          for (let child of node.childNodes) {
            traverse(child)
          }
          truncated += `</${node.tagName.toLowerCase()}>`
        }
      }

      for (let child of body.childNodes) {
        traverse(child)
        if (currentLength >= maxLength) break
      }

      return truncated
    }

    setTruncatedHtml(truncateHtml(cleanHtml, 500))
  }, [cleanHtml])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div id="post-description" className="flex flex-col w-full gap-3 px-4 pb-4">
      <div className="w-full font-normal">
        {parse(isExpanded ? cleanHtml : truncatedHtml)}
      </div>
      {cleanHtml.length > 500 && (
        <button onClick={handleToggle} className="text-orangeFpt font-semibold">
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

export default PostContents