const {body} = require('express-validator');

exports.blogValidator =
    [
        body('title','Enter a valid title')
        .isAlphanumeric()
        .trim(),
        body('imageUrl','Enter a valid URL')
        .isURL()
        .trim(),
    ];
