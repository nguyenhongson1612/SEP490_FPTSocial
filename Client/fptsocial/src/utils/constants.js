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
  SHARE_POST: 'share',
  PROFILE_POST: 'profile',
  PHOTO_POST: 'photo',
  VIDEO_POST: 'video',
  GROUP_POST: 'group',
  GROUP_PHOTO_POST: 'group-photo',
  GROUP_VIDEO_POST: 'group-video',
  GROUP_SHARE_POST: 'group-share'
}

export const COMMENT_TYPES = {
  MAIN_COMMENT: 'mainComment',
  PHOTO_COMMENT: 'photoComment',
  VIDEO_COMMENT: 'videoComment',
  MAIN_GROUP_COMMENT: 'groupComment',
  PHOTO_GROUP_COMMENT: 'photoGroupComment',
  VIDEO_GROUP_COMMENT: 'videoGroupComment'
}

// export const SHARE_LOCATION = {
//   STORY: 'story',
//   GROUP: 'group',
// }

export const EDITOR_TYPE = {
  STORY: 'story',
  GROUP: 'group',
  SHARE: 'share',
  COMMENT: 'comment'
}

export const UPDATE = 'update'
export const CREATE = 'create'

export const PUBLIC = 'public'
export const PRIVATE = 'private'

export const SEARCH_TYPE = {
  ALL: 'All',
  GROUP: 'Group',
  USER: 'User',
  POST: 'Post'
}


export const ADMIN = 'admin'
export const CENSOR = 'censor'
export const MEMBER = 'member'

export const APPROVE = 'Approve'
export const DECLINE = 'Decline'

export const REPORT_TYPES = {
  POST: 'post',
  COMMENT: 'comment',
  PROFILE: 'profile'
}