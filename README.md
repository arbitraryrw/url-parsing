# url-parsing
The purpose of this project is to explore an approach to handling relative URLs safely for redirects and forwards. Many web security vulnerabilities that originate from unvalidated redirects and forwards are often remediated by restricting URLs. This restriction usually takes the form of an allow-list of known good absolute URLs in some capacity. See [OWASP Validating URLs](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html#validating-urls) or [Google Open Redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html#preventing-unvalidated-redirects-and-forwards)
 for examples of this. Unfortunately, not all applications can adopt an allow-listing approach because the absolute URL may not be known ahead of time. This can cause friction as the one-size-fits all approach does not always work.

## Introduction
Objectively, URL parsing is difficult. There are many individual components that comprise a URL, and how each component interacts with one another can be confusing. For example, authority delegation in a URL. [Orange Tsai](https://twitter.com/orange_8361) presented [A New Era of SSRF](https://paper.seebug.org/papers/Security%20Conf/Blackhat/2017_us/us-17-Tsai-A-New-Era-Of-SSRF-Exploiting-URL-Parser-In-Trending-Programming-Languages.pdf) at Black Hat USA 2017 highlighting some of the problems that can arise.

## Background
The syntax and semantics of a URI are intentionally broad to create an extensible means for identifying resources. This introduces ambiguity as there are inconsistencies between URL parsers and the [RFC2396](https://tools.ietf.org/html/rfc2396) / [RFC3986](https://tools.ietf.org/html/rfc3986) specifications. [WHATWG](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_the_whatwg_url_api) defined a contemporary implementation based on these specifications forming a standard. The following comporises [URL Strings and URL Objects](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_url_strings_and_url_objects).

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

At a code level, a URL can be parsed and accessed through a convinient object as seen below: 

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

## Authority

[RFC3986 - Authority](https://tools.ietf.org/html/rfc3986#page-17)

```
3.2.  Authority

   Many URI schemes include a hierarchical element for a naming
   authority so that governance of the name space defined by the
   remainder of the URI is delegated to that authority (which may, in
   turn, delegate it further).  The generic syntax provides a common
   means for distinguishing an authority based on a registered name or
   server address, along with optional port and user information.

   The authority component is preceded by a double slash ("//") and is
   terminated by the next slash ("/"), question mark ("?"), or number
   sign ("#") character, or by the end of the URI.

      authority   = [ userinfo "@" ] host [ ":" port ]

   URI producers and normalizers should omit the ":" delimiter that
   separates host from port if the port component is empty.  Some
   schemes do not allow the userinfo and/or port subcomponents.

   If a URI contains an authority component, then the path component
   must either be empty or begin with a slash ("/") character.  Non-
   validating parsers (those that merely separate a URI reference into
   its major components) will often ignore the subcomponent structure of
   authority, treating it as an opaque string from the double-slash to
   the first terminating delimiter, until such time as the URI is
   dereferenced.
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

## Dangerous Characters
 Modern browsers automatically convert back slashes (`\`) into forward slashes (`/`) despite this being against [RFC3986 - URI Genric Syntax](https://tools.ietf.org/html/rfc3986). In addition, the `@` character can be used to define a target host redirecting the victim to a new domain, this type of attack is defined as [Semantic Attacks](https://tools.ietf.org/html/std66#section-7.6).

 The dangerous characters and encoded versions can be seen below:

```
127.0.0.1:3000?nextUrl=//nikola.dev
127.0.0.1:3000?nextUrl=/%2Fnikola.dev
127.0.0.1:3000?nextUrl=%2F%2Fnikola.dev
127.0.0.1:3000?nextUrl=\\nikola.dev
127.0.0.1:3000?nextUrl=\%5Cnikola.dev
127.0.0.1:3000?nextUrl=%5C%5Cnikola.dev
```

Interestingly, the `\` and `/` characters (and URL encoded equivalents) can repeat and are interchangable. The following is a valid payload:

```
http://127.0.0.1:3000/?nextUrl=/%5C/%5C/\%2F\/\%2F\/\%2F\/nikola.dev
```

## Basic Usage
Run the application locally using the following:

```
node app.js
```

## References:
- [Google Open Redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html#preventing-unvalidated-redirects-and-forwards)
- [OWASP Preventing Unvalidated Redirects and Forwards](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html#preventing-unvalidated-redirects-and-forwards)
- [OWASP Validating URLs](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html#validating-urls)
- [Orange Tsai - A New Era of SSRF](https://paper.seebug.org/papers/Security%20Conf/Blackhat/2017_us/us-17-Tsai-A-New-Era-Of-SSRF-Exploiting-URL-Parser-In-Trending-Programming-Languages.pdf)