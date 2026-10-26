import hashlib
import re
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

_TRACKING = re.compile(r"^(utm_.*|fbclid|gclid|igshid|ref|ref_src|source|campaign|cmpid|ito|_ga)$", re.I)
_DROP_PARAMS = {("page", "all")}  # Kompas appends ?page=all to the same article
_TITLE_SUFFIX = re.compile(r"\s+[-|–—]\s+[^-|–—]{2,40}$")


def canonical_url(url: str) -> str:
    parts = urlsplit(url.strip())
    host = parts.netloc.lower()
    host = host[4:] if host.startswith("www.") else host
    query = [
        (k, v)
        for k, v in parse_qsl(parts.query, keep_blank_values=True)
        if not _TRACKING.match(k) and (k.lower(), v.lower()) not in _DROP_PARAMS
    ]
    path = parts.path.rstrip("/") or "/"
    return urlunsplit((parts.scheme.lower() or "https", host, path, urlencode(sorted(query)), ""))


def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def url_hash(url: str) -> str:
    return sha256(canonical_url(url))


def strip_media_suffix(title: str) -> str:
    """Google News titles end with ' - Media Name'."""
    return _TITLE_SUFFIX.sub("", title.strip())


def title_fingerprint(title: str) -> str:
    """Same story syndicated on several sites collapses to one fingerprint."""
    normalised = re.sub(r"[^a-z0-9 ]+", " ", strip_media_suffix(title).lower())
    return sha256(re.sub(r"\s+", " ", normalised).strip())
