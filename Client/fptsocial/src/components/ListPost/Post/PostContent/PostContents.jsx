import React from 'react'
import LazyImage from '~/components/LazyImage'
import { cleanAndParseHTML } from '~/utils/formatters'

function PostContents({ postData, postType }) {
  const cleanHtml = cleanAndParseHTML(postData?.content)

  return (
    <div id="post-description"
      className="flex flex-col w-full gap-3 px-4 pb-4"
    >
      <div className="">
        {cleanHtml}
      </div>
    </div>
  )
}

export default PostContents