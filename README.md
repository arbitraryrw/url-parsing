# url-parsing

## Introduction

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            href                                             │
├──────────┬──┬─────────────────────┬─────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │        host         │           path            │ hash  │
│          │  │                     ├──────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │   hostname   │ port │ pathname │     search     │       │
│          │  │                     │              │      │          ├─┬──────────────┤       │
│          │  │                     │              │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.host.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │   hostname   │ port │          │                │       │
│          │  │          │          ├──────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │        host         │          │                │       │
├──────────┴──┼──────────┴──────────┼─────────────────────┤          │                │       │
│   origin    │                     │       origin        │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴─────────────────────┴──────────┴────────────────┴───────┤
│                                            href                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```
Taken  from [URL Strings and URL Objects](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_url_strings_and_url_objects).

```
const { URL } = require('url');
var url = 'https://user:pass@sub.host.com:8080/p/a/t/h?query=string#has'
var newUrl = new URL(url);
console.log(newUrl)
```


```
URL {
  href: 'https://user:pass@sub.host.com:8080//p/a/t/h?query=string#has',
  origin: 'https://sub.host.com:8080',
  protocol: 'https:',
  username: 'user',
  password: 'pass',
  host: 'sub.host.com:8080',
  hostname: 'sub.host.com',
  port: '8080',
  pathname: '//p/a/t/h',
  search: '?query=string',
  searchParams: URLSearchParams { 'query' => 'string' },
  hash: '#has'
}
```

## Relative URLs

- [RFC3986 - URI Genric Syntax](https://tools.ietf.org/html/rfc3986) 
- [Relative Reference](https://tools.ietf.org/html/rfc3986#section-4.2)

```
relative-part = "//" authority path-abempty
              / path-absolute
              / path-noscheme
              / path-empty
```

```
A relative reference that begins with two slash characters is termed
a network-path reference; such references are rarely used.  A
relative reference that begins with a single slash character is
termed an absolute-path reference.  A relative reference that does
not begin with a slash character is termed a relative-path reference.
```

## Canonicalization
Defined in the[ WHATWG Goals](https://url.spec.whatwg.org/#goals), if a url contains [percent-encoded bytes](https://url.spec.whatwg.org/#percent-encoded-byte) it returns [percent-decode](https://url.spec.whatwg.org/#percent-decode).

An example of this can be seen below:

```
node app.js
Server running at http://127.0.0.1:3000/

URL Requested
Raw url: /?nextUrl=/nikola.dev
Parsed nextUrl parameter: /nikola.dev

URL Requested
Raw url: /?nextUrl=%2Fnikola.dev
Parsed nextUrl parameter: /nikola.dev
```

## Basic Usage
Run the application locally using the following:

```
node app.js
```