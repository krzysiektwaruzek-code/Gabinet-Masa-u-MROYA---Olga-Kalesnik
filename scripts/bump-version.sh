#!/usr/bin/env bash
# Dopisuje do plików CSS/JS znacznik wersji (?v=...), aby przeglądarki i cache hostingu
# pobrały nową wersję po każdej zmianie. Uruchom przed każdym wgraniem strony na serwer.
#
# Użycie:   ./scripts/bump-version.sh
set -euo pipefail

cd "$(dirname "$0")/.."
V="$(date +%Y%m%d%H%M)"

sed -i -E "s#(assets/(css|js)/[A-Za-z0-9._-]+\.(css|js))(\?v=[A-Za-z0-9._-]*)?\"#\1?v=${V}\"#g" index.html 404.html
sed -i -E "s#(/assets/(css|js)/[A-Za-z0-9._-]+\.(css|js))(\?v=[A-Za-z0-9._-]*)?\"#\1?v=${V}\"#g" 404.html

echo "Wersja zasobów: ${V}"
grep -ho 'assets/[a-z]*/[A-Za-z0-9._-]*\.\(css\|js\)?v=[0-9]*' index.html 404.html | sort -u
