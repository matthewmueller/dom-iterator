
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

test:
	@./node_modules/.bin/mocha --reporter spec

test-browser:
	@./node_modules/.bin/component-test browser

npm:
	@mv ./node_modules/props-component ./node_modules/props 2> /dev/null; true;

.PHONY: clean test test-browser
