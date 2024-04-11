import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://ctf-citadel.github.io',
	integrations: [
		starlight({
			title: 'CTF-Citadel',
			customCss: [
				'./src/styles/custom.css',
			],
			social: {
				github: 'https://github.com/CTF-Citadel',
			},
			sidebar: [
				{
					label: 'Introduction', link: '/introduction'
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Quick Start', link: '/guides/quickstart' },
						{ label: 'Development', link: '/guides/development' },
						{ label: 'Management', link: '/guides/management' },
						{ label: 'Challenge Creation', link: '/guides/create-challenges' },
					],
				},
				{
					label: 'Documentation',
					items: [
						{ label: 'Web-App', link: '/doc/webapp' },
						{ label: 'Anti-Cheat', link: '/doc/anticheat' },
						{ label: 'Firstblood', link: '/doc/firstblood' },
						{ label: 'Infrastructure', link: '/doc/infra'},
						{ label: 'Challenges', link: '/doc/challenges' },
						{ label: 'Teams', link: '/doc/teams' },
						{ label: 'Scoring', link: '/doc/scoring' },
					],
				},
				{
					label: 'About', link: '/about'
				},
			],
		}),
	],
});
