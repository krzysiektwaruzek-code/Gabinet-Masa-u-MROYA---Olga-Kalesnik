#!/usr/bin/env bash
# Podstawia właściwą domenę w miejsce znacznika __SITE_URL__ (canonical, Open Graph,
# JSON-LD, sitemap.xml, robots.txt).
#
# Użycie:   ./scripts/set-domain.sh https://twojadomena.pl
set -euo pipefail

if [[ $# -ne 1 || ! "$1" =~ ^https://[a-zA-Z0-9.-]+(:[0-9]+)?$ ]]; then
  echo "Użycie: $0 https://twojadomena.pl   (bez ukośnika na końcu)" >&2
  exit 1
fi

cd "$(dirname "$0")/.."
grep -rl --include='*.html' --include='*.xml' --include='*.txt' '__SITE_URL__' . \
  | grep -v '^./.git/' \
  | xargs sed -i "s|__SITE_URL__|$1|g"

echo "Gotowe. Pozostałe wystąpienia znacznika:"
grep -rn '__SITE_URL__' . --exclude-dir=.git --exclude-dir=scripts || echo "  brak"
