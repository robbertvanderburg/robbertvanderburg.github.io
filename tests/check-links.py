"""Verify public outbound links in a built Jekyll site. Uses stdlib and curl."""
import argparse
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


class Anchors(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()

    def handle_starttag(self, tag, attrs):
        url = dict(attrs).get("href", "")
        if tag == "a" and urlsplit(url).scheme in ("http", "https"):
            self.urls.add(url)


def check(url):
    args = [
        "curl", "--silent", "--show-error", "--location", "--proto", "=https,http",
        "--proto-redir", "=https,http", "--max-time", "20", "--connect-timeout", "7",
        "--output", "/dev/null", "--write-out", "%{http_code} %{url_effective}",
    ]
    for method in ("HEAD", "GET"):
        result = subprocess.run(args + (["--head"] if method == "HEAD" else []) + ["--", url],
                                capture_output=True, text=True)
        status, _, destination = result.stdout.partition(" ")
        if result.returncode == 0 and status.startswith("2"):
            break
    if result.returncode == 0 and status == "202":
        outcome = "accepted-unconfirmed"
    elif result.returncode == 0 and status.startswith("2"):
        outcome = "reachable"
    elif result.returncode == 0 and status in {"401", "403", "429", "451"}:
        outcome = "access-restricted"
    else:
        outcome = "failed"
    return {"url": url, "outcome": outcome, "status": status, "method": method,
            "finalURL": destination, "error": result.stderr.strip()}


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("site", nargs="?", type=Path, default=Path("_site"))
    cli.add_argument("--output", type=Path)
    options = cli.parse_args()
    anchors = Anchors()
    for page in ("index.html", "publications/index.html", "cv/index.html", "news/index.html"):
        anchors.feed((options.site / page).read_text())
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(check, sorted(anchors.urls)))
    for result in results:
        print(result["status"], result["outcome"], result["url"])
    if options.output:
        options.output.write_text(json.dumps(results, indent=2) + "\n")
    return int(any(result["outcome"] == "failed" for result in results))


if __name__ == "__main__":
    raise SystemExit(main())
