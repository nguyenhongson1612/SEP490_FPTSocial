import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: {
        translation: {
          admin: {
            sidebar: {
              manage: 'Manage',
              report: {
                report_manage: 'Reports Manager'
              }
            }
          },
          standard: {
            home: {
              sidebar: {
                feeds: 'Feeds',
                friends: 'Friends',
                groups: 'Groups',
                your_shortcut: 'Your shortcuts',
              },
              rightSidebar: {
                suggestion: 'Suggestions for you',
                notification: 'Latest notifications',
                contact: 'Contact'
              }
            },
            profile: {
              updateProfile: 'Update Your Profile',
              friend: 'Friend',
              cancelRequest: 'Cancel request',
              addFriend: 'Add friend',
              confirmRequest: 'Confirm request',
              deleteRequest: ' Delete request',
              report: 'Report',
              block: 'Block',
              posts: 'Posts',
              about: 'About',
              friends: 'Friends',
              photos: 'Photos',
              videos: 'Videos',
            },
            newPost: {
              createPost: 'Create post',
              post: 'Post',
              editPhoto: 'Edit photo/video',
              editAll: 'Edit all',
              addPhoto: 'Add photos/videos',
              writeSt: 'Write something',
              editPost: 'Edit post',
              savePost: 'Save'
            },
            search: {
              searchResult: 'Search results',
              post: 'Post',
              user: 'User',
              group: 'Group',
              all: 'All'
            }
          },
          sideText: {
            mutualFriend: 'mutual friends',
            noneSuggestion: 'No suggestions are suitable for you',
            noneNotification: 'You have no notifications',
            yourMind: `What's on your mind`
          },
          message: {

          }
        }
      },
      vn: {
        translation: {
          admin: {
            sidebar: {
              manage: 'Quản lý',
              report: {
                report_manage: 'Quản lý báo cáo vi phạm'
              }
            }
          },
          standard: {
            home: {
              sidebar: {
                feeds: 'Bảng feeds',
                friends: 'Bạn bè',
                groups: 'Nhóm',
                your_shortcut: 'Lối tắt của bạn',
              },
              rightSidebar: {
                suggestion: 'Đề xuất cho bạn',
                notification: 'Thông báo mới nhất',
                contact: 'Người liên hệ'
              }
            },
            profile: {
              updateProfile: 'Chỉnh sửa trang cá nhân',
              friend: 'Bạn bè',
              cancelRequest: 'Hủy yêu cầu',
              addFriend: 'Thêm bạn bè',
              confirmRequest: 'Chấp nhận lời mời',
              deleteRequest: 'Xóa yêu cầu',
              report: 'Báo cáo',
              block: 'Chặn',
              posts: 'Bài viết',
              about: 'Giới thiệu',
              friends: 'Bạn bè',
              photos: 'Ảnh',
              videos: 'Video',
            },
            newPost: {
              createPost: 'Tạo bài viết',
              post: 'Đăng bài',
              editPhoto: 'Chỉnh sửa ảnh/video',
              editAll: 'Chỉnh sửa',
              addPhoto: 'Thêm ảnh/video',
              writeSt: 'Bạn đang nghĩ gì',
              editPost: 'Chỉnh sửa bài viết',
              savePost: 'Lưu'
            },
            search: {
              searchResult: 'Kết quả tìm kiếm',
              post: 'Bài viết',
              user: 'Mọi người',
              group: 'Hội nhóm',
              all: 'Tất cả'
            }
          },
          sideText: {
            mutualFriend: 'bạn chung',
            noneSuggestion: 'Không có đề xuất nào phù hợp cho bạn',
            noneNotification: 'Bạn không có thông báo mới',
            yourMind: `Bạn đang nghĩ gì thế`
          },
          message: {

          }
        }
      },
    }
  });

export default i18n
