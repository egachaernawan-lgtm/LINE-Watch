"""Indonesian media only: reject links hosted under another country's domain.

Google News in Indonesian also returns foreign sites that publish an /id/ edition (vietnam.vn, *.it ...).
`.id`, `.com`, `.co`, `.net`, `.org`, `.io` and any country code not listed below pass, so legitimate
Indonesian outlets on generic domains (kompas.com, tempo.co) are kept. Extra hosts to reject live in
topics.yaml under `blocked_hosts`.
"""

from functools import lru_cache
from pathlib import Path
from urllib.parse import urlsplit

import yaml

FOREIGN_TLDS = {
    "vn", "it", "sg", "my", "th", "ph", "jp", "kr", "cn", "hk", "tw", "in", "au", "nz", "uk", "de", "fr", "es",
    "pt", "ru", "br", "mx", "ar", "tr", "sa", "ae", "za", "ng", "ke", "pk", "bd", "lk", "np", "kh", "la", "mm",
    "nl", "be", "ch", "at", "se", "no", "dk", "fi", "pl", "cz", "gr", "ie", "il", "eg", "ca",
}


@lru_cache
def _blocked_hosts() -> frozenset[str]:
    data = yaml.safe_load((Path(__file__).parents[2] / "seed" / "topics.yaml").read_text(encoding="utf-8"))
    return frozenset(h.lower() for h in data.get("blocked_hosts", []))


def is_indonesian_url(url: str) -> bool:
    host = (urlsplit(url).hostname or "").lower().removeprefix("www.")
    if not host:
        return False
    if host.rsplit(".", 1)[-1] in FOREIGN_TLDS:
        return False
    return not any(host == b or host.endswith("." + b) for b in _blocked_hosts())
