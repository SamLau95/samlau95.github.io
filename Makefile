.PHONY: help serve build clean

TODAY := $(shell date +"%m-%d")

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

serve: ## Starts server that auto-builds on file changes
	pnpm dev

build: ## Builds website once
	pnpm build

clean: ## Removes generated files
	rm -rf .astro dist

push: ## pushes changes
	git add -A
	git commit -m "update $(TODAY)" --allow-empty
	git pull origin main
	git push origin main
