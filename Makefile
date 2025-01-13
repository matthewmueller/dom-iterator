
build: components index.js
	@./node_modules/.bin/component build --dev

components: component.json
	@./node_modules/.bin/component install --dev

clean:
	rm -fr build components template.js

test:
	@./node_modules/.bin/_mocha --reporter spec

test-browser:
	@./node_modules/.bin/component-test browser

.PHONY: clean test test-browser
