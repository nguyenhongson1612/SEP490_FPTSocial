let apiRoot = ""
// dev environment
if (process.env.BUILD_MODE === "dev") {
  apiRoot = "https://localhost:44329"
  // apiRoot = "https://fptforum-h0gtf0cmbhb8dkgq.eastus-01.azurewebsites.net"
}
// deploy environment
if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://fptforum-h0gtf0cmbhb8dkgq.eastus-01.azurewebsites.net"
}
export const API_ROOT = apiRoot;

import ukFlag from '~/assets/img/ukFlag.png'
import vnflag from '~/assets/img/vnFlag.png'
export const LANGUAGES = [
  { label: "English", code: "en", flag: ukFlag },
  { label: "Tiếng Việt", code: "vn", flag: vnflag }
]

export const POST_TYPES = {
  SHARE_POST: "share",
  PROFILE_POST: "profile",
  PHOTO_POST: "photo",
  VIDEO_POST: "video",
  GROUP_POST: "group",
  GROUP_PHOTO_POST: "group-photo",
  GROUP_VIDEO_POST: "group-video",
  GROUP_SHARE_POST: "group-share",
};

export const COMMENT_TYPES = {
  MAIN_COMMENT: "mainComment",
  PHOTO_COMMENT: "photoComment",
  VIDEO_COMMENT: "videoComment",
  MAIN_GROUP_COMMENT: "groupComment",
  PHOTO_GROUP_COMMENT: "photoGroupComment",
  VIDEO_GROUP_COMMENT: "videoGroupComment",
};

// export const SHARE_LOCATION = {
//   STORY: 'story',
//   GROUP: 'group',
// }

export const EDITOR_TYPE = {
  STORY: "story",
  GROUP: "group",
  SHARE: "share",
  COMMENT: "comment",
};

export const UPDATE = "update";
export const CREATE = "create";

export const PUBLIC = "public";
export const PRIVATE = "private";

export const SEARCH_TYPE = {
  ALL: "All",
  GROUP: "Group",
  USER: "User",
  POST: "Post",
};

export const ADMIN = "admin";
export const CENSOR = "censor";
export const MEMBER = "member";

export const APPROVE = "Approve";
export const DECLINE = "Decline";

export const REPORT_TYPES = {
  POST: "post",
  COMMENT: "comment",
  PROFILE: "profile",
}

export const CHAT_KEY = {
  ProjectID: "d7c4f700-4fc1-4f96-822d-8ffd0920b438",
  PrivateKey: "62e47fdf-0ea8-429d-a68a-af5d0932ffac",
};

export const DEFAULT_AVATAR = "http://res.cloudinary.com/dqitgxwfl/image/upload/v1722218189/img/null/sy5sr97c29l4jddxkuk0.png"