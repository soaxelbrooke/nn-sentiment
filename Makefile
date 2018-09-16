
.PHONY: fmt
fmt:
	./node_modules/prettier/bin-prettier.js --write 'src/**/*.js'
	./node_modules/prettier/bin-prettier.js --write 'test/**/*.js'
