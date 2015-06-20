var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    templates  = require('metalsmith-templates'),
    less = require('metalsmith-less'),
    handlebars = require('handlebars'),
    imagemin = require('metalsmith-imagemin'),
    reverseEach = require( 'bullhorn-handlebars-helpers/src/collection/reverseEach' )( handlebars ),
    highlight  = require('highlight.js'),
    watch = require('metalsmith-watch'),
    fs = require('fs');
    cleanCSS = require('metalsmith-clean-css');

// templating 
handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.html').toString());
handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.html').toString());

// handlebars.registerHelper('images', function(id){
//     var html = '';
//     for (var i = collection.length -1; i >= 0 ; i--) {
//             html += '<div class="four columns">';
//             html += '<a href="' + collection[i].path + '"><h4 class="p5Title">' + collection[i].title + '</a></h4>';
//             html += '<img class="u-max-full-width" src="/' + collection[i].image + '">';
//             html += '</div>';
//     };
//     return html
// });

Metalsmith(__dirname)
    .source('src')
    .metadata({
        site: {
            title: 'ReadMe',
            url: 'http://vincentricard.github.io/DRAFT'
        }
      })
    .use(collections({
        commits: {
            pattern: 'commits/*.md',
            sortBy: 'date',
            reverse: true,
            metadata: {
                name: 'commits',
                description: 'List of commits'
            }
        }
    }))
    .use(markdown({
        gfm: false,
        tables: true,
        sanitize : false
        // highlight: function (code, lang) {
        //     if (!lang) {
        //         return code;
        //     }
        //     try {
        //         return highlight.highlight(lang, code).value;
        //     } catch (e) {
        //         return code;
        //     }
        // }
    }))
    // .use(imagemin({
    //     optimizationLevel: 3,
    //     svgoPlugins: [{ removeViewBox: false }]
    //   }))
    .use(permalinks())
    .use(templates('handlebars'))
    .use(less({
        pattern:'css/style.less'
    }))
    .use(cleanCSS({
        files: 'css/style.css',
        cleanCSS: {
            rebase: true,
            minify: true
        }
    }))
    .destination('./build')
    .build(function (err) {
        if (err) {
            throw err;
        } else {
            console.log(this);
        }
    })