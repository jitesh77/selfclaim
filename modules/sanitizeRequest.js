/**
 * @author Varun Kumar <https://github.com/varunon9>
 * Date: 15 May, 2018
 */

function sanitizeObject(object) {
    Object.keys(object).forEach((element) => {
        if (typeof(object[element]) == 'string') {
            object[element] = object[element].replace(/&/g, '&amp;');
            object[element] = object[element].replace(/</g, '&lt;');
            object[element] = object[element].replace(/"/g, '&quot;');
            object[element] = object[element].replace(/'/g, '&#039;');
            object[element] = object[element].replace(/>/g, '&gt;');
        } 
    });
    return object;
}

module.exports = (body) => {
    Object.keys(body).forEach((element) => {
        if (typeof(body[element]) == 'string') {
            body[element] = body[element].replace(/&/g, '&amp;');
            body[element] = body[element].replace(/</g, '&lt;');
            body[element] = body[element].replace(/"/g, '&quot;');
            body[element] = body[element].replace(/'/g, '&#039;');
            body[element] = body[element].replace(/>/g, '&gt;');
        } else if (typeof(body[element]) == 'object') {
            // check if it's not array
            if (body[element].constructor === Array) {
            } else {
                body[element] = sanitizeObject(body[element]);
            }
        } 
    });
    return body;
}