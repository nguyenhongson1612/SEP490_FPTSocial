let apiRoot = ''
// dev environment
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'https://localhost:44329'
}
// deploy environment
if (process.env.BUILD_MODE === 'production') {
  apiRoot = ''
}
export const API_ROOT = apiRoot

export const POST_TYPES = {
  MAIN_POST: 'mainPost',
  PHOTO_POST: 'photoPost',
  VIDEO_POST: 'videoPost',
  MAIN_GROUP_POST: 'groupPost',
  PHOTO_GROUP_POST: 'photoGroupPost',
  VIDEO_GROUP_POST: 'videoGroupPost'
}

export const COMMENT_TYPES = {
  MAIN_COMMENT: 'mainComment',
  PHOTO_COMMENT: 'photoComment',
  VIDEO_COMMENT: 'videoComment',
  MAIN_GROUP_COMMENT: 'groupComment',
  PHOTO_GROUP_COMMENT: 'photoGroupComment',
  VIDEO_GROUP_COMMENT: 'videoGroupComment'
}
