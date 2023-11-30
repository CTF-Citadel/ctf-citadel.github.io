import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://ctf-citadel.github.io',
	integrations: [
		starlight({
			title: 'CTF-Citadel',
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
						{ label: 'Event Creation', link: '/guides/create-events' },
						{ label: 'Challenge Creation', link: '/guides/create-challenges' },
					],
				},
				{
					label: 'Documentation',
					items: [
						{ label: 'Platform', link: '/doc/webapp' },
						{ label: 'Anti-Cheat', link: '/doc/anticheat' },
						{ label: 'Challenges', link: '/doc/challenges' },
						{ label: 'Teams', link: '/doc/teams' },
						{ label: 'Leaderboard', link: '/doc/scoreboard' },
					],
				},
			],
		}),
	],
});
