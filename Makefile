default:
	browserify main.js -o public/js/bundle.js

develop:
	budo main.js:public/js/bundle.js --serve js/bundle.js --live --host 127.0.0.1 --open --dir ./public -v
