export const WHITESPACE_RULE = /\S/
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const WHITESPACE_MESSAGE = 'Not accept only whitespace.'

export const PHONE_NUMBER_RULE = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
export const PHONE_NUMBER_MESSAGE = 'Phone number is invalid in vietnam'

export const EMAIL_RULE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const EMAIL_MESSAGE = 'Email is invalid. (example@example.com)'

export const URL_RULE = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
export const URl_MESSAGE = 'Url is invalid'

// file validate
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept jpg, jpeg and png'
  }
  return null
}