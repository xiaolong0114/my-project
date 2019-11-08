import zh from './zh'
import en from './en'
const langObj = {
    zh,
    en
}
export default function getLang(locale) {
    if (!locale || !Object.keys(langObj).includes(locale)) {
        return langObj['zh']
    }
    return langObj[locale]
}