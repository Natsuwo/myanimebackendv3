
module.exports = {
    getDriveId(url) {
        var regExp = /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file)\/d\/|\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
        var match = url.match(regExp);
        if (!match) {
            return false;
        }
        return match[1];
    },
    urlValid(text) {
        var regExp = RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)
        var valid = regExp.test(text);
        return valid
    },
    dupSource(source, type, audio, subtitle, suffix) {
        var dup = false
        if (source.type === type
            && source.audio === audio
            && source.subtitle === subtitle
            && source.suffix === suffix) {
            dup = true
        }
        return dup
    },
    changeToSlug(str) {
        var title, slug;
        //Lấy text từ thẻ input title 
        title = str;
        //Đổi chữ hoa thành chữ thường
        slug = title;
        //Đổi ký tự có dấu thành không dấu
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        //Xóa các ký tự đặt biệt
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\[|\]|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        //Đổi khoảng trắng thành ký tự gạch ngang
        slug = slug.replace(/ /gi, "_");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        slug = slug.replace(/\-\-\-\-\-/gi, '_');
        slug = slug.replace(/\-\-\-\-/gi, '_');
        slug = slug.replace(/\-\-\-/gi, '_');
        slug = slug.replace(/\-\-/gi, '_');
        //Xóa các ký tự gạch ngang ở đầu và cuối
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        //In slug ra textbox có id “slug”
        return encodeURIComponent(slug)
    }
}