rm nordValidator.xpi
zip -r nordValidator.xpi manifest.json nordValidator-bg.js _locales libs content_scripts icons options -x *.swp *.DS_Store "*~"
