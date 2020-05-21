const pinyin = require("pinyin")
export default {
    methods: {
        chgNameZh(val) {
            let letters = pinyin(val, { heteronym: false, style: pinyin.STYLE_NORMAL })
            let name = ''
            for (const letter of letters) {
                name += letter[0]
            }
            this.form.project_name = name
        }
    }
}