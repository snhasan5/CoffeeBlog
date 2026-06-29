const {body} = require('express-validator');

exports.blogValidator =
    [
        body('title','Enter a valid title')
        .trim()
        .isAlphanumeric(),
        
    ];
