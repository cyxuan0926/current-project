import config from '@/service/urls'
export const setPrisonUrl = url => /^(http|https).*/.test(url) ? url : `${ config.jailApiHost }${ url }`
