#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const NODE_VERSION = '22.21.0';
const PROJECT_ROOT = resolve(import.meta.dirname, '..');

class LocalDockerBuilder {
	constructor(options = {}) {
		this.version = options.version || 'local-dev';
		this.releaseType = options.releaseType || 'dev';
		this.platform = options.platform || 'linux/amd64';
		this.push = options.push || false;
		this.buildN8n = options.buildN8n !== false;
		this.buildRunners = options.buildRunners !== false;
		this.buildRunnersDistroless = options.buildRunnersDistroless !== false;
		this.registry = options.registry || 'local';
	}

	exec(command, options = {}) {
		console.log(`\n$ ${command}\n`);
		try {
			const output = execSync(command, {
				cwd: PROJECT_ROOT,
				stdio: 'inherit',
				...options,
			});
			return output;
		} catch (error) {
			console.error(`Command failed: ${command}`);
			throw error;
		}
	}

	checkPrerequisites() {
		console.log('=== Checking prerequisites ===');

		// Check Docker
		try {
			this.exec('docker --version', { stdio: 'pipe' });
			console.log('✓ Docker is installed');
		} catch {
			throw new Error('Docker is not installed or not running');
		}

		// Check Docker Buildx
		try {
			this.exec('docker buildx version', { stdio: 'pipe' });
			console.log('✓ Docker Buildx is available');
		} catch {
			throw new Error('Docker Buildx is not available');
		}

		// Check if Dockerfiles exist
		const dockerfiles = [
			'docker/images/n8n/Dockerfile',
			'docker/images/runners/Dockerfile',
			'docker/images/runners/Dockerfile.distroless',
		];

		for (const dockerfile of dockerfiles) {
			const path = resolve(PROJECT_ROOT, dockerfile);
			if (!existsSync(path)) {
				throw new Error(`Dockerfile not found: ${dockerfile}`);
			}
		}
		console.log('✓ All Dockerfiles found');
	}

	buildApplication() {
		console.log('\n=== Building n8n application ===');
		this.exec('pnpm build:n8n > build.log 2>&1');

		// Check last few lines for errors
		this.exec('tail -n 20 build.log');
		console.log('✓ Application built successfully');
	}

	setupBuildx() {
		console.log('\n=== Setting up Docker Buildx ===');

		// Create or use existing builder
		try {
			this.exec('docker buildx inspect n8n-local-builder', { stdio: 'pipe' });
			console.log('✓ Using existing builder: n8n-local-builder');
		} catch {
			this.exec('docker buildx create --name n8n-local-builder --use');
			console.log('✓ Created new builder: n8n-local-builder');
		}
	}

	generateImageTag(imageName) {
		const platformShort = this.platform.split('/').pop(); // amd64 or arm64

		if (this.registry === 'local') {
			return `${imageName}:${this.version}`;
		} else {
			// For custom registry
			return `${this.registry}/${imageName}:${this.version}`;
		}
	}

	buildDockerImage(config) {
		const { name, dockerfile, imageName } = config;

		console.log(`\n=== Building ${name} Docker image ===`);

		const tag = this.generateImageTag(imageName);
		const pushFlag = this.push ? '--push' : '--load';

		const buildArgs = [
			`NODE_VERSION=${NODE_VERSION}`,
			`N8N_VERSION=${this.version}`,
			`N8N_RELEASE_TYPE=${this.releaseType}`,
		].map(arg => `--build-arg ${arg}`).join(' ');

		const command = `docker buildx build \\
			--platform ${this.platform} \\
			--file ${dockerfile} \\
			--tag ${tag} \\
			${buildArgs} \\
			${pushFlag} \\
			.`;

		this.exec(command);
		console.log(`✓ ${name} image built: ${tag}`);

		return tag;
	}

	async build() {
		const startTime = Date.now();
		const builtImages = [];

		try {
			console.log('=== n8n Local Docker Build ===');
			console.log(`Version: ${this.version}`);
			console.log(`Release Type: ${this.releaseType}`);
			console.log(`Platform: ${this.platform}`);
			console.log(`Push: ${this.push}`);
			console.log(`Registry: ${this.registry}`);

			// Step 1: Check prerequisites
			this.checkPrerequisites();

			// Step 2: Build application
			this.buildApplication();

			// Step 3: Setup Docker Buildx
			this.setupBuildx();

			// Step 4: Build Docker images
			if (this.buildN8n) {
				const tag = this.buildDockerImage({
					name: 'n8n',
					dockerfile: 'docker/images/n8n/Dockerfile',
					imageName: 'n8n',
				});
				builtImages.push(tag);
			}

			if (this.buildRunners) {
				const tag = this.buildDockerImage({
					name: 'Task Runners (Alpine)',
					dockerfile: 'docker/images/runners/Dockerfile',
					imageName: 'runners',
				});
				builtImages.push(tag);
			}

			if (this.buildRunnersDistroless) {
				const tag = this.buildDockerImage({
					name: 'Task Runners (Distroless)',
					dockerfile: 'docker/images/runners/Dockerfile.distroless',
					imageName: 'runners-distroless',
				});
				builtImages.push(tag);
			}

			// Summary
			const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
			console.log('\n=== Build Complete ===');
			console.log(`Duration: ${duration} minutes`);
			console.log('\nBuilt images:');
			builtImages.forEach(tag => console.log(`  - ${tag}`));

			if (!this.push) {
				console.log('\nTo run the n8n image:');
				console.log(`  docker run -p 5678:5678 ${builtImages[0]}`);
			}

		} catch (error) {
			console.error('\n❌ Build failed:', error.message);
			process.exit(1);
		}
	}
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
	const args = process.argv.slice(2);

	const getArg = (name, defaultValue) => {
		const index = args.indexOf(`--${name}`);
		return index !== -1 && args[index + 1] ? args[index + 1] : defaultValue;
	};

	const hasFlag = (name) => args.includes(`--${name}`);

	if (hasFlag('help')) {
		console.log(`
Usage: node scripts/local-docker-build.mjs [options]

Options:
  --version <version>          Version tag for the image (default: local-dev)
  --release-type <type>        Release type: stable, nightly, dev, branch (default: dev)
  --platform <platform>        Target platform (default: linux/amd64)
                               Examples: linux/amd64, linux/arm64
  --registry <registry>        Docker registry (default: local)
                               Use 'local' for local builds or specify your registry
  --push                       Push to registry (default: false, loads locally)
  --skip-n8n                   Skip building n8n image
  --skip-runners               Skip building runners image
  --skip-runners-distroless    Skip building runners distroless image
  --help                       Show this help message

Examples:
  # Build for local testing
  node scripts/local-docker-build.mjs

  # Build specific version
  node scripts/local-docker-build.mjs --version 1.0.0 --release-type stable

  # Build for ARM64
  node scripts/local-docker-build.mjs --platform linux/arm64

  # Build and push to custom registry
  node scripts/local-docker-build.mjs --registry ghcr.io/myorg --push

  # Build only n8n image
  node scripts/local-docker-build.mjs --skip-runners --skip-runners-distroless
`);
		process.exit(0);
	}

	const builder = new LocalDockerBuilder({
		version: getArg('version', 'latest'),
		releaseType: getArg('release-type', 'dev'),
		platform: getArg('platform', 'linux/amd64'),
		registry: getArg('registry', 'local'),
		push: hasFlag('push'),
		buildN8n: !hasFlag('skip-n8n'),
		buildRunners: !hasFlag('skip-runners'),
		buildRunnersDistroless: !hasFlag('skip-runners-distroless'),
	});

	builder.build();
}

export default LocalDockerBuilder;
