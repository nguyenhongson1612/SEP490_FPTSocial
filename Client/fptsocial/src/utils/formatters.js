import DOMPurify from 'dompurify'
import parse from 'html-react-parser'
import moment from 'moment'

//prevent spam click call api
export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}

export const cleanAndParseHTML = (html, isIncludeMedia = false) => {
  if (isIncludeMedia) {
    const mediaRegex = /<!--MEDIA:(video|image):(.+?)-->/g
    const mediaMatches = [...html.matchAll(mediaRegex)]

    if (mediaMatches.length > 0) {
      const mediaInfo = mediaMatches.map(match => ({
        type: match[1],
        url: match[2]
      }))
      return mediaInfo
    }
    else return []
  }

  const cleanHtml = parse(DOMPurify.sanitize(html))
  return cleanHtml
};

export const compareDateTime = (date) => {
  const serverDate = moment(date)
  const timeAgo = serverDate.fromNow()
  return timeAgo
}

export const handleCoverImg = (coverUrl) => {
  return coverUrl
    ? { backgroundImage: `url(${coverUrl})` }
    : {
      background: 'linear-gradient(to bottom, #E9EBEE 80%, #8b9dc3 100%)'
    }
}