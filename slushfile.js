/*
 * slush-hybrid-base
 * https://github.com/brettsmason/slush-hybrid-base
 *
 * Copyright (c) 2015, Brett Mason
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    title = require('to-title-case'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        themeName: title(workingDirName.trim().replace(/-/g,' ')),
        themeSlug: _.slugify(workingDirName).toLowerCase(),
        themeURI: 'http://www.brettmason.co.uk/themes/' + _.slugify(workingDirName).toLowerCase(),
        themeAuthor: 'Brett Mason',
        authorURI: 'http://www.brettmason.co.uk',
        authorEmail: 'brett@brettmason.co.uk',
        themeDescription: 'An advanced theme built with search-engine optimization (SEO) in mind by utilizing the most current HTML5 conventions and <a href="http://schema.org">Schema.org</a> microdata.'
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'themeName',
        message: 'What is the name of the theme?',
        default: defaults.themeName
    }, {
    	name: 'themeSlug',
        message: 'What is theme slug?',
        default: defaults.themeSlug
    }, {
        name: 'themeURI',
        message: 'What is the theme URL?',
        default: defaults.themeURI
    }, {
        name: 'themeAuthor',
        message: 'What is the author name?',
        default: defaults.themeAuthor
    }, {
        name: 'authorURI',
        message: 'What is the author website?',
        default: defaults.authorURI
    }, {
        name: 'authorEmail',
        message: 'What is the author Email address?',
        default: defaults.authorEmail
    }, {
        name: 'themeDescription',
        message: 'Please briefly describe this theme.',
        default: defaults.themeDescription
    }, {
        type: 'checkbox',
        name: 'themeTags',
        message: 'Please select some theme tags.',
        choices: [
	      {
	        name: 'dark'
	      },
	      {
	        name: 'light'
	      },
	      {
	        name: 'one-column',
	        checked: true
	      },
	      {
	        name: 'two-columns',
	        checked: true
	      },
	      {
	        name: 'left-sidebar',
	        checked: true
	      },
	      {
	        name: 'right-sidebar',
	        checked: true
	      },
	      {
	        name: 'accessibility-ready',
	        checked: true
	      },
	      {
	        name: 'translation-ready',
	        checked: true
	      },
	      {
	        name: 'rtl-language-support',
	        checked: true
	      },
	      {
	        name: 'featured-images',
	        checked: true
	      },
	      {
	        name: 'threaded-comments',
	        checked: true
	      },
	      {
	        name: 'responsive-layout',
	        checked: true
	      },
	      {
	        name: 'editor-style',
	        checked: true
	      },
	      {
	        name: 'microformats',
	        checked: true
	      },
	      {
	        name: 'post-formats',
	        checked: false
	      },
	      {
	        name: 'custom-background',
	        checked: false
	      },
	      {
	        name: 'custom-colors',
	        checked: false
	      },
	      {
	        name: 'custom-headers',
	        checked: false
	      },
	      {
	        name: 'custom-headers',
	        checked: false
	      },
	    ],
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.themePrefix = answers.themeName.trim().replace(/ /g,'_').toLowerCase();
            gulp.src(__dirname + '/templates/theme/**')
                .pipe(template(answers))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
