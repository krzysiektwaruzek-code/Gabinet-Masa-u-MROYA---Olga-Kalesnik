# Gabinet Masażu u Mroya — strona internetowa

Statyczna strona-wizytówka (HTML / CSS / JS, bez frameworków i bez kroku budowania), gotowa do wgrania na Hostinger.

> **Zasada projektu: zero zmyślania.** Na stronie znajdują się wyłącznie informacje potwierdzone (patrz niżej).
> Brakujące dane to wyraźnie oznaczone miejsca „Wkrótce" — nie wypełniamy ich przypuszczeniami.

## Co jest potwierdzone, a co nie

| Informacja | Status | Źródło |
|---|---|---|
| Nazwa: **Gabinet Masażu u Mroya** | potwierdzone | nazwa repozytorium nadana przez zleceniodawcę |
| Osoba: **Olga Kalesnik** | do potwierdzenia przez właściciela | nazwa repozytorium (pokazana tylko jako podpis w karcie „Gabinet") |
| Adres: **Femika Strefa Kobiet, ul. Jaworowa 6, 80-175 Gdańsk** | potwierdzone | podany przez zleceniodawcę |
| Link do wizytówki Google Maps | potwierdzone | podany przez zleceniodawcę (`cid=17050173415233364946`) |
| Telefon, e-mail, godziny otwarcia | **brak** | nie udało się potwierdzić — pole „Wkrótce" |
| Usługi, ceny, opis, opinie, zdjęcia, logo | **brak** | nie udało się potwierdzić — nic nie wymyślono |

Research: bezpośredni dostęp do Google Maps, Facebooka, Booksy, ZnanyLekarz, Fresha i femika.pl był zablokowany
przez politykę sieciową środowiska, w którym powstała strona. Wyszukiwarka nie zwróciła żadnego potwierdzonego
wpisu dotyczącego samego gabinetu „u Mroya". Dane **Femiki** (telefon, e-mail, cennik) dotyczą innego podmiotu
(lokalu pod tym adresem), więc **nie zostały** przypisane gabinetowi.

## Struktura

```
index.html              strona główna (one-page) + dane strukturalne JSON-LD
404.html                strona błędu
robots.txt, sitemap.xml SEO (z znacznikiem __SITE_URL__ do podmiany)
.htaccess               Apache/LiteSpeed: cache, kompresja, nagłówki bezpieczeństwa, 404
assets/
  css/tokens.css        kolory, typografia, odstępy (zmieniasz tutaj)
  css/base.css          reset, typografia, dostępność
  css/layout.css        nagłówek, hero, sekcje, stopka
  css/components.css    przyciski, karty, formularz, mapa, animacje
  js/main.js            menu, reveal, mapa po kliknięciu, formularz (bez zależności)
  fonts/                Fraunces + Inter (WOFF2, tylko znaki łacińskie i polskie, licencja OFL)
  img/                  favicon (tymczasowy znak geometryczny), grafika Open Graph
scripts/set-domain.sh   podmiana __SITE_URL__ na właściwą domenę
```

Podgląd lokalny: `python3 -m http.server 8080` w katalogu projektu, potem `http://127.0.0.1:8080`.

## Do uzupełnienia po otrzymaniu danych od klienta

Miejsca w `index.html` oznaczone komentarzem `UZUPEŁNIJ` i atrybutem `data-fill`:

- [ ] **Godziny otwarcia** — karta `data-fill="godziny"` (sekcja „O gabinecie") i wiersz w sekcji „Kontakt".
      Po uzupełnieniu usuń klasę `fact-card--pending` i znacznik `.pill`.
- [ ] **Telefon / e-mail** — karta `data-fill="kontakt"` oraz wiersze `telefon` i `email` w „Kontakcie"
      (użyj `<a href="tel:+48…">` / `<a href="mailto:…">`).
- [ ] **Oferta i cennik** — zastąp blok `.empty-state` (`data-fill="oferta"`) siatką `.service-grid`.
      Szablon karty usługi jest w komentarzu nad blokiem, style są już gotowe.
- [ ] **Opis gabinetu** — akapit w „O gabinecie".
- [ ] **Zdjęcia** — tylko prawdziwe, od klienta (WebP/JPEG, `loading="lazy"`, opisowe `alt`).
- [ ] **Logo** — gdy klient je dostarczy, zastąp typograficzny znak w nagłówku i `assets/img/favicon.svg`.
- [ ] **JSON-LD** (`<head>` w `index.html`) — dodaj `telephone`, `openingHoursSpecification`, `geo`, `image`
      dopiero po potwierdzeniu. Nie dodawaj `aggregateRating` bez realnych, weryfikowalnych opinii.
- [ ] **Polityka prywatności** — dane administratora i link przy zgodzie w formularzu (wymóg RODO).
- [ ] **CTA** — obecnie „Napisz do gabinetu" / „Skontaktuj się". Jeśli właściciel potwierdzi rezerwacje,
      można zmienić na „Umów wizytę".

## Wdrożenie na Hostingerze

1. Podmień znacznik domeny: `./scripts/set-domain.sh https://twojadomena.pl`
   (aktualizuje canonical, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`).
2. Wgraj zawartość repozytorium do `public_html` (Menedżer plików / FTP) **albo** podłącz repo przez
   *Hosting → Git* w hPanelu.
3. Włącz certyfikat SSL, następnie odkomentuj przekierowanie HTTPS w `.htaccess`.
4. Zgłoś `sitemap.xml` w Google Search Console.
5. Uzupełnij i zweryfikuj wizytówkę Google (dane NAP muszą być identyczne ze stroną).

## Formularz kontaktowy

Frontend jest gotowy (walidacja, dostępność, pułapka antyspamowa). **Nie wysyła jeszcze danych** — celowo
nie wymyślono adresu e-mail ani backendu. Dopóki atrybut `data-endpoint` formularza jest pusty, użytkownik
widzi komunikat, że formularz nie jest aktywny. Aby podłączyć:

- wpisz URL w `<form … data-endpoint="…">` (wysyłany jest `POST` z `FormData`, odpowiedź `2xx` = sukces);
- możliwe rozwiązania: usługa formularzy (np. Formspree, Web3Forms) albo własny skrypt PHP na Hostingerze.

## Wydajność, dostępność, prywatność

- Brak zewnętrznych fontów i bibliotek; łączny rozmiar fontów ≈ 75 KB; JS ≈ 8 KB.
- Mapa Google ładuje się dopiero po kliknięciu (szybszy start, brak śledzenia bez zgody).
- Brak cookies i analityki, więc baner cookies nie jest potrzebny. **Dodanie analityki to zmieni.**
- Semantyczny HTML, link „Przejdź do treści", widoczny fokus, `prefers-reduced-motion`, kontrast WCAG AA,
  audyt axe-core: 0 naruszeń.

## Znane ograniczenia

- Osadzenie mapy (iframe Google) nie zostało przetestowane na żywo — środowisko budowy blokowało google.com.
  Sprawdź po wdrożeniu, czy pinezka wskazuje właściwy punkt; w razie potrzeby podmień `data-src` w sekcji lokalizacji.
- Favicon i grafika Open Graph to neutralne elementy typograficzno-geometryczne, **nie** logo firmy.
