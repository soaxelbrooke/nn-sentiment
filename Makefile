
.PHONY: fmt
fmt:
	./node_modules/prettier/bin-prettier.js --write 'src/**/*.js'
	./node_modules/prettier/bin-prettier.js --write 'test/**/*.js'


.PHONY: test-server
test-server:
	python -m http.server 39283
