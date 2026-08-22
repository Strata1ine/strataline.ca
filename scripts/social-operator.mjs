import { createHmac } from 'node:crypto';

const action = process.argv[2];
if (!['status', 'retry'].includes(action)) throw new Error('Use status or retry.');
const secret = process.env.SOCIAL_DISPATCH_SECRET;
const origin = (process.env.SOCIAL_OPERATOR_ORIGIN ?? 'https://strataline.ca').replace(/\/$/, '');
if (!secret) throw new Error('SOCIAL_DISPATCH_SECRET is required.');
const options = Object.fromEntries(
	process.argv.slice(3).map((value) => {
		const [key, ...rest] = value.replace(/^--/, '').split('=');
		return [key, rest.join('=')];
	}),
);
const body =
	action === 'retry' ? JSON.stringify({ slug: options.slug, platform: options.platform }) : '';
if (action === 'retry' && (!options.slug || !options.platform))
	throw new Error('Retry requires --slug and --platform.');
const timestamp = String(Date.now());
const signature = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
const response = await fetch(`${origin}/.netlify/functions/social-${action}`, {
	method: action === 'retry' ? 'POST' : 'GET',
	headers: {
		...(body ? { 'content-type': 'application/json' } : {}),
		'x-social-timestamp': timestamp,
		'x-social-signature': signature,
	},
	body: body || undefined,
});
if (!response.ok)
	throw new Error(`Operator endpoint returned HTTP ${response.status}: ${await response.text()}`);
console.log(JSON.stringify(await response.json(), null, 2));
