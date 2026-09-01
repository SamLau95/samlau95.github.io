.PHONY: help serve astro tailscale build clean

TODAY := $(shell date +"%m-%d")

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

serve: astro tailscale ## Starts Astro and exposes it to the tailnet

astro:
	pnpm dev

tailscale:
	tailscale serve http://localhost:4321

build: ## Builds website once
	pnpm build

clean: ## Removes generated files
	rm -rf .astro dist

push: ## pushes changes
	git add -A
	git commit -m "update $(TODAY)" --allow-empty
	git pull origin main
	git push origin main
