# head_checker

A Cloudflare Worker that checks the HTTP status code of the HEAD request to a given URL.

## Description

This project provides a simple API endpoint that accepts a URL as a query parameter and returns the HTTP status code of a HEAD request to that URL. It is useful for quickly checking the availability or status of a web resource without downloading the entire content.

## Installation and Deployment

This project uses [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/) to develop and deploy the Cloudflare Worker.

1. Install Wrangler globally if you haven't already:

```bash
npm install -g wrangler
```

2. Authenticate Wrangler with your Cloudflare account:

```bash
wrangler login
```

3. Deploy the worker:

```bash
wrangler deploy
```

## Usage

Send a GET request to the deployed worker URL with the `url` query parameter set to the URL you want to check. For example:

```
https://your-worker-domain.workers.dev/?url=https://example.com
```

The response will be a JSON object containing the HTTP status code of the HEAD request:

```json
{
  "status": 200
}
```

If the `url` parameter is missing, the response will be:

```json
{
  "error": "Missing 'url' parameter"
}
```

### Batch Usage

Send a `POST` request to `/batch` with a JSON body containing a `urls` array:

```
{
  "urls": ["https://example.com", "https://example.org"]
}
```

The response will map each URL to its HTTP status code:

```json
{
  "results": {
    "https://example.com": 200,
    "https://example.org": 404
  }
}
```

If the `urls` parameter is missing or not an array, the response will be:

```json
{
  "error": "Missing 'urls' parameter"
}
```

## Development

To run the worker locally in development mode:

```bash
wrangler dev
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. To run tests:

```bash
npm test
