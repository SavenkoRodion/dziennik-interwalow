# Dziennik interwałów · brief iteracji 2

Jedno dotknięcie zamyka interwał. Drugi scenariusz to odczyt dzisiejszych czasów i notatek. Zmiany obejmują prezentację, przy zachowaniu znaczenia istniejących przycisków i danych.

| Decyzja | Rekomendacja i podstawa | Rodzaj | Pewność |
|---|---|---|---|
| Cele dotykowe | Tagi od 48 × 48 CSS px, odstęp 8 px, główna akcja od 56 px. [Android](https://support.google.com/accessibility/android/answer/7101858) zaleca 48 dp i odstęp 8 dp. [WCAG 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) określa minimum 24 CSS px z wyjątkami. | FAKT dla WCAG, KONWENCJA dla wymiarów aplikacji | Wysoka dla 48/8, średnia dla 56 |
| Zasięg | [Parhi i in.](https://www.microsoft.com/en-us/research/publication/target-size-study-for-one-handed-thumb-use-on-small-touchscreen-devices/) uzyskali 9,2 mm dla pojedynczych trafień. [Bergström-Lehtovirta i Oulasvirta](https://www.netlab.tkk.fi/~oulasvir/pubs/paper2117.pdf) uzależniają zasięg od chwytu, dłoni i urządzenia. [Azenkot i Zhai](https://cris.technion.ac.il/en/publications/touch-behavior-with-different-postures-on-soft-smartphone-keyboar/) badali różnice trafień podczas pisania w różnych chwytach. | FAKT | Wysoka |
| Położenie | Szeroki „Koniec interwału” na dole daje swobodę wyboru miejsca dotknięcia — **moja ocena**. Pięć neutralnych tagów nad nim, bez przewijania w bok. Istniejący Stop zostaje przy stanie sesji. | KONWENCJA | Średnia |
| Hierarchia | Czas i historia na początku, eksport i backup w rozwijanych sekcjach. [Nielsen](https://www.nngroup.com/articles/progressive-disclosure/) proponuje odsłanianie opcji drugorzędnych na żądanie. Błąd zapisu i przypomnienie o kopii mają własne widoczne miejsce. | KONWENCJA | Wysoka |
| Historia | Data raz na grupę, godziny po lewej, długość po prawej, treść poniżej. [Few](https://mail.perceptualedge.com/images/Effective_Chart_Design.pdf) poleca układ tabelaryczny do odczytu wartości. [Tufte](https://www.edwardtufte.com/wp-content/uploads/2024/10/Citation-Classic-Current-Contents-Dec.14-1992.pdf) łączy gęstość z ułatwianiem porównań. [Material 1](https://m1.material.io/components/lists.html) to starsza specyfikacja z wariantem 60 dp dla dwóch linii. Około 60 CSS px dla krótkiego wpisu to konwencja projektowa. Wiersz rośnie wraz z treścią. | KONWENCJA | Średnia |
| Typografia | Systemowy krój, cyfry tabelaryczne. Przy bazie 16 px rozmiar/interlinia to 14/20 dla godzin, 16/22 dla treści, 20/24 dla nagłówków i 32/36 dla licznika. Rytm odstępów 4, 8, 12 i 16 px. Dobór do aplikacji to moja ocena na podstawie hierarchii list Material. | KONWENCJA | Średnia |
| Dotyk i klawiatura | Obrys podczas nacisku, wpis jako potwierdzenie. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action) opisuje przewijanie i pinch-zoom przy manipulation. Panel wraca do przepływu strony przez CSS przy fokusie notatki. [web.dev](https://web.dev/blog/viewport-units) rozróżnia dynamiczną wysokość okna i klawiaturę. Dolna krawędź uwzględnia [safe area](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env). Brak animacji również przy preferencji ograniczonego ruchu. | KONWENCJA | Średnia do próby z Gboard |

## Kolor

Motyw wynika z preferencji systemowej. [Material 3](https://developer.android.com/develop/ui/compose/designsystems/material3) przypisuje kolorom role. [WCAG 1.4.1, 1.4.3 i 1.4.11](https://www.w3.org/TR/WCAG22/) wymaga dodatkowego sygnału obok koloru, kontrastu 4,5:1 dla zwykłego tekstu i 3:1 dla informacji potrzebnej do rozpoznania kontrolki lub stanu. FAKT, pewność wysoka. Konkretne kolory to KONWENCJA.

| Rola | Jasny | Ciemny |
|---|---|---|
| Tło / powierzchnia | #F3F5F1 / #FFFFFF | #101713 / #1B251F |
| Tekst / pomocniczy na powierzchni | #17251E (15,91:1) / #4E6055 (6,71:1) | #F4F8F5 (14,72:1) / #B8C9BD (9,11:1) |
| Tekst / tło głównego przycisku | #FFFFFF / #146348 (7,22:1) | #102C1E / #8FE0B6 (9,64:1) |
| Obwódka na powierzchni | #68786E (4,67:1) | #617367 (3,12:1) |

Przyciski tagów są neutralne. Wyłącznie małe etykiety w historii korzystają z [Okabe–Ito](https://jfly.uni-koeln.de/color/), zawsze z nazwą. Kontrast czarnego tekstu wynosi dla scroll #56B4E9 9,10:1, gra #CC79A7 6,86:1, posiłek #E69F00 9,32:1, drzemka #009E73 6,14:1, przerwa #D55E00 5,43:1.

## Wzorce i rozbieżności

[Samsung Clock](https://images.samsung.com/is/content/samsung/p5/ca/support/mobile-devices/galaxy-s9-plus-how-do-i-access-the-user-manual-on-my-samsung-galaxy-s9-plus/pdf/SM-G96X_UG_EN4.pdf) rozdziela międzyczas i Stop. [Toggl](https://support.toggl.com/en-us/article/toggl-track-timer-for-android-1v3i5g8/) uruchamia pomiar z dolnej części listy. [Clockify](https://clockify.me/help/apps/android-app) udostępnia przerwę jako osobną akcję widżetu. [Strava](https://support.strava.com/en-us/articles/15402137-how-do-i-record-an-activity-on-strava) umieszcza Start przy dolnej krawędzi. Przeniesienie wzorców do dziennika to KONWENCJA, pewność średnia.

Minimum WCAG, zalecenie Androida i pomiar w milimetrach mają różne cele i jednostki. Dla częstych trafień przyjmujemy większe cele. Odrzucone warianty to pozioma karuzela tagów (wymaga gestu), wibracja (wychodzi poza zmianę wizualną) i osobna karta dla każdej daty powtarzanej przy wpisie (zajmuje miejsce).

## Testy ręczne

- [ ] **Realme 8 5G, Chrome, jedna ręka.** Uruchom sesję z historią dłuższą niż ekran. Przewiń do starszego wpisu. Dotknij kolejno scroll, gra, posiłek, drzemka i przerwa, za każdym razem zaczynając przy starszym wpisie. Każdy tag ma jednym dotknięciem zamknąć dokładnie jeden interwał i rozpocząć następny. Sprawdź pięć nowych wpisów i ich etykiety.
- [ ] **Realme 8 5G, Gboard.** Otwórz starszy wpis i dotknij notatki. Przy otwartej klawiaturze widać pole notatki i przycisk „Gotowe”. Panel szybkich akcji jest odpięty. Po „Gotowe” panel znów jest dostępny podczas przewijania.
- [ ] Sprawdź jasny i ciemny motyw, powiększony tekst, wpis przez północ oraz ręczne kopiowanie backupu z przypomnienia przy niedostępnym schowku.

## Iteracja 3

| Decyzja | Uzasadnienie i źródło | Rodzaj i pewność |
|---|---|---|
| Niezależne dni, cały nagłówek ≥48 CSS px | Natywne details/summary przełącza stan. Własny disclosure wymagałby obsługi przycisku i synchronizacji stanu. Prosty tekst w summary omija rozbieżności w odczycie zagnieżdżonych nagłówków. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary), [APG disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), [APG accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) | FAKT o mechanizmach, wysoka. Natywna kontrolka i wymiar z iteracji 2 to KONWENCJA. |
| Dzisiaj rozwinięte, w razie braku zapisów ostatni dzień | APG dopuszcza różne reguły otwierania paneli. Można porównać kilka otwartych dni. Ręczny wybór zachowujemy w pamięci strony. [APG](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) | KONWENCJA, moja ocena, średnia |
| Data po lewej, „Zapisano …” po prawej | Few wiąże układ tabelaryczny z odczytem konkretnych wartości. Po rozwinięciu pokazujemy liczbę wpisów oraz najdłuższy odcinek przypadający na dany dzień. Model Li, Deya i Forlizzi wyróżnia integrację zapisów i późniejszą refleksję. [Few](https://mail.perceptualedge.com/images/Effective_Chart_Design.pdf), [CHI 2010](https://my.eng.utah.edu/~cs5540/au16/readings/PersonalInformatics-Li2010.pdf) | FAKT o modelu, wysoka. Dobór metryk to moja ocena, średnia. |
| Czas per tag w stałej kolejności | Nazwa i wartość umożliwiają odczyt w obu motywach. WCAG wymaga dodatkowego sygnału obok koloru i kontrastu 3:1 dla niezbędnych elementów nietekstowych. Paleta etykiet pochodzi z iteracji 2. [WCAG 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | FAKT dla kryteriów, wysoka. Układ to KONWENCJA, średnia. |
| Podział na lokalne daty | Następną północ wyznaczamy z lokalnego roku, miesiąca i następnego dnia. Różnica znaczników daje czas rzeczywisty, także podczas zmiany czasu. [ECMAScript](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-constructor), [MDN Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate), [terminy w Polsce](https://eli.gov.pl/api/acts/DU/2022/539/text.html) | FAKT, wysoka |
| Odroczenie tworzenia wierszy | Nagłówki powstają przy renderze historii, szczegóły przy pierwszym otwarciu danej sekcji. Większy DOM może zwiększyć koszt interakcji. [web.dev](https://web.dev/articles/dom-size-and-interactivity) | FAKT o DOM, wysoka. Wybór strategii to moja ocena. |

**Reguły prezentacji (moja ocena).** Obliczenia sumują milisekundy. Nagłówek pokazuje sumę zaokrągloną do minuty. Najpierw każda kategoria dostaje pełne minuty, potem pozostałe minuty trafiają do kategorii z największą resztą sekund. Remisy rozstrzyga kolejność listy. Przykładowo dwa tagi po 40 s dają razem 1 min na ekranie. Wiersze z wynikiem 0 min są ukryte. Lista wpisów zachowuje dokładność do sekund. Kolejność to pięć szybkich tagów, ewentualne inne nazwy z importu, „bez tagu” i „trwa”. Pierwsza z dwóch ostatnich kategorii obejmuje zakończone wpisy z pustym polem tag. Cały bieżący interwał, także w poprzednim dniu, należy do „trwa” według chwili renderowania.

**Długie wpisy.** Od 8 godzin rzeczywistego czasu cały wpis otrzymuje etykietę „długi interwał” na każdym swoim fragmencie. Próg to **moja ocena, pewność średnia**. Pozwala zauważyć pomiar pozostawiony na noc. Cały czas wchodzi do sum. Każdy fragment zakończonego wpisu otwiera tę samą notatkę. Wewnętrzne luki w historii mają opis „brak zapisów”.

**Temporal i alternatywy.** TC39 potwierdza Stage 4, Chrome od 144 i Firefox od 139. MDN oznacza API jako spoza Baseline. Źródła różnią się dla Safari: Can I Use wskazuje dostępność w Technology Preview, a bieżąca tabela MDN BCD podaje wersję 27.3. Flaga dotyczyła eksperymentalnej implementacji WebKit. Dziennik korzysta z Date i formatuje daty przez Intl.DateTimeFormat. [TC39](https://github.com/tc39/proposal-temporal/blob/main/README.md), [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal), [BCD](https://raw.githubusercontent.com/mdn/browser-compat-data/main/javascript/builtins/Temporal.json), [Can I Use](https://caniuse.com/temporal). Odrzucono pasek proporcji i koło, bo użytkownik odczytuje czas w minutach. Oś 24 h odpowiadałaby na pytanie o porę dnia i wymagałaby obsługi powtarzającej się godziny jesienią.

### Testy ręczne iteracji 3

1. Najpierw zachowaj własny backup poza aplikacją. Do sprawdzania dokładnych sum użyj osobnego, pustego profilu przeglądarki ze strefą Europe/Warsaw. Wklej backup-testowy.json w istniejący importer i potwierdź 2004 nowe wpisy.
2. W marcu sprawdź 28.03 = 30 min i 29.03 = 2 godz. 30 min (gra). W październiku 24.10 = 30 min i 25.10 = 4 godz. 30 min (scroll). 26.10 to luka.
3. 27.10 = 4 godz., 28.10 = 8 godz. W dniu 28.10 widać 7 godz. „bez tagu” i 1 godz. „przerwa”. Nocny wpis ma etykietę na obu fragmentach. Zmień notatkę przez jeden fragment i sprawdź drugi. Koniec o północy nie tworzy wpisu 29.10.
4. Uruchom pomiar i po ponad minucie przeładuj stronę. „Trwa” ma osobny czas, zgodny z nagłówkiem i pozostałymi kategoriami. Dotknij szybkiego tagu. Poprzedni czas przechodzi do wybranego tagu. Przez kolejną minutę bez interakcji tyka tylko zegar sesji i interwału.
5. Rozwiń dwa starsze dni. Dodaj szybki wpis i sprawdź stan obu sekcji. Po przeładowaniu wraca stan początkowy. Na Realme sprawdź gesty jedną ręką, brak przewijania w bok przy powiększonym tekście, nagłówki i przyciski ≥48 px, Gboard oraz jasny i ciemny motyw. Sprawdź kontrast tekstu 4,5:1 i istotnych nietekstowych wskaźników 3:1. Tab, Enter, Spacja oraz TalkBack powinny umożliwić rozpoznanie daty, sumy i stanu rozwinięcia.
6. W profilu testowym z własnym wpisem zapisz backup, zaimportuj dane testowe i porównaj oryginalny wpis, ustawienia i sesję. Drugi import tego samego pliku ma pokazać 0 nowych wpisów. Otwieranie dni nie zmienia JSON w localStorage. Porównaj CSV sprzed i po zmianie widoku dla obu filtrów. Kopię ze starszej wersji wczytaj w pustym profilu i sprawdź notatki, identyfikatory i tagi.
7. Dla 40 dni po 50 wpisów w styczniu i lutym sprawdź start, pierwszy dotyk dnia oraz szybki tag na telefonie. Zwinięte początkowo dni zawierają tylko nagłówek.

**Pomiar kontrolny.** Chrome headless na Windows, profil testowy, szerokość 360 CSS px, Europe/Warsaw, 2004 wpisy i 46 dni. Mediany z siedmiu prób po imporcie, łącznie z wymuszeniem układu: ponowny render historii z odroczonymi szczegółami 8,1 ms, wariant tworzący od razu wszystkie szczegóły 34,5 ms, utworzenie i pokazanie dnia z 50 wpisami 7,1 ms, pełna obsługa szybkiego tagu 9 ms. Wyniki opisują lokalny komputer. Pomiar dotyku i odczytu TalkBack na telefonie pozostaje testem ręcznym.

## Iteracja 4 — instalacja i praca offline

| Decyzja | Uzasadnienie | Ocena |
| --- | --- | --- |
| Manifest i adres | `display: standalone`, `start_url: ./`, `scope: ./`, `id: /dziennik-interwalow/`. Ścieżkę katalogową przyjęto na podstawie nazwy repozytorium. W briefie zamiast adresu z telefonu został placeholder. Przed wdrożeniem porównaj adres z telefonu z manifestem. Jeśli dotychczasowy adres kończy się `index.html`, ustaw `start_url: ./index.html`. Jeśli katalog ma inną nazwę albo aplikacja działa w katalogu głównym, dopasuj `id` do faktycznej ścieżki katalogu z końcowym ukośnikiem. Manifest rozwiązuje `start_url` i `scope` względem swojego adresu, a `id` względem origin adresu startowego. `sw.js` jest obok HTML, więc domyślnie kontroluje ten katalog. [W3C](https://www.w3.org/TR/appmanifest/), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register) | FAKT, wysoka dla zakresu. Moja ocena, ścieżka do potwierdzenia. |
| Instalacja i test | HTTPS, nazwa, ikony 192 i 512 px, adres startowy i tryb samodzielny. Chrome oddziela instalację z menu od promocji instalacji. Artykuł z 2023 r. wymagający obsługi `fetch` dla promocji jest starszy niż lista web.dev, która ją pomija. Worker odpowiada za pracę offline. Kategorię PWA w Lighthouse wycofano. Sprawdzamy Manifest i Service Workers w DevTools Application oraz rzeczywistą instalację na telefonie. [Kryteria](https://web.dev/articles/install-criteria), [Chrome](https://developer.chrome.com/blog/update-install-criteria), [DevTools](https://developer.chrome.com/docs/devtools/progressive-web-apps) | FAKT, wysoka. |
| Paczka offline | Cache-first dla HTML, manifestu i ikon. Osobny cache dla wydania oraz prefiks z zakresem aplikacji. Instalacja sprawdza sumę każdego pliku. Błąd albo niespójność plików przerywa instalację. Worker obsługuje wskazane adresy z własnego origin. Dane dziennika są w localStorage. [Cykl życia workera](https://web.dev/articles/service-worker-lifecycle), [strategie cache](https://developer.chrome.com/docs/workbox/caching-strategies-overview/) | KONWENCJA i moja ocena, wysoka. |
| Aktualizacja | Otwarty HTML pokazuje swój identyfikator w ustawieniach. Gdy kolejny worker czeka, przycisk „Zaktualizuj” wysyła `SKIP_WAITING`. Karta, w której go użyto, przeładowuje się po zmianie kontrolera. Karta bez kontrolera przeładowuje się po aktywacji. Pozostałe karty zachowują otwarty dokument, a kod przed zapisem sprawdza schemat w pamięci. [Cykl życia workera](https://web.dev/articles/service-worker-lifecycle) | FAKT dla cyklu życia, moja ocena dla obsługi aktualizacji, wysoka. |
| Dane i eksport | Ten sam profil Chrome i origin dają dostęp do wspólnego localStorage w przeglądarce i WebAPK. Przy nowszym schemacie blokujemy zapis, import i czyszczenie. Backup JSON kopiuje dokładny zapis z localStorage. CSV odczytuje rozpoznawalne wpisy z polami zgodnymi z obecną wersją. Jeżeli kiedyś zmieni się struktura wpisów, pełne dane pozostaną w JSON. Odczyt wersji przed zapisem wykrywa wcześniej zapisaną migrację. Standard HTML nie gwarantuje blokady między oknami na czas odczytu i zapisu. [HTML](https://html.spec.whatwg.org/multipage/webstorage.html), [WebAPK](https://web.dev/articles/webapks) | FAKT dla pamięci i ograniczeń zapisu, moja ocena dla blokady, wysoka. |
| Trwałość | Przyznana pamięć trwała chroni przed automatycznym usunięciem pod presją miejsca. Usunięcie danych witryny lub profilu Chrome obejmuje też WebAPK. Zachowanie samego odinstalowania WebAPK i systemowej operacji „Wyczyść dane” na pozycji dziennika pozostaje niezweryfikowane na Realme. [Storage Standard](https://storage.spec.whatwg.org/), [WebAPK](https://web.dev/articles/webapks) | FAKT dla udokumentowanych zachowań, wysoka. |
| Motyw i ikony | Manifest deklaruje jasne tło `#f3f5f1` i kolor `#146348`. HTML dobiera kolor motywu, w ciemnym trybie `#101713`. Zachowujemy `100dvh`, dolny safe-area i natywne Wstecz. Dwie ikony PNG mają cel `any`, osobna ikona `maskable` ma tło do krawędzi i znak wewnątrz koła o promieniu 40% boku. [W3C](https://www.w3.org/TR/appmanifest/), [web.dev](https://web.dev/articles/maskable-icon) | FAKT dla strefy ikony, KONWENCJA i moja ocena dla doboru kolorów, wysoka. |

### Publikacja tego i kolejnych wydań

1. Na telefonie skopiuj backup JSON z obecnej wersji i zapisz go poza aplikacją. Otwórz kopię i sprawdź, czy zawiera wpisy.
2. Porównaj dokładny adres z telefonu z `start_url`, `scope` i `id`. Zachowaj dotychczasowy HTTPS, host i ścieżkę. Publikuj w tym samym katalogu i przez dotychczasową konfigurację hostingu.
3. Gdy zmieniasz ikonę, uruchom `python tools/generate_icons.py`. Przed każdą publikacją uruchom `python tools/stamp_release.py`. Wersja uwzględnia treść pakietu offline i kod workera. Skrypt zapisuje ten sam identyfikator w HTML i workerze oraz przypina sumy plików pobieranych podczas instalacji.
4. Zatwierdź razem HTML, worker, manifest i ikony. Publikuj je jako jedno wydanie. Gdy hosting kopiuje pliki pojedynczo, publikuj worker na końcu. Hosting powinien podawać pliki z zachowaniem bajtów i bez przekierowań dla zasobów zestawu offline.
5. Otwórz dotychczasowy adres w Chrome online. W DevTools Application sprawdź manifest, zakres workera i stan aktywny. Po pierwszej instalacji workera ponownie otwórz dziennik online, aby strona znalazła się pod jego kontrolą. Porównaj wersję w ustawieniach z wynikiem skryptu.

### Testy ręczne na Realme 8 5G

1. Przed instalacją zanotuj liczbę wpisów i treść przykładowej notatki. Z menu Chrome zainstaluj dziennik. Uruchom z ikony i sprawdź osobne okno bez paska adresu, zapamiętany interwał, historię i możliwość skopiowania backupu JSON.
2. Zamknij okno dziennika, włącz tryb samolotowy i uruchom z ikony. Zakończ interwał szybkim tagiem, edytuj notatkę i ponownie uruchom aplikację offline. Sprawdź zapis i oba eksporty.
3. Na testowej kopii zmień kod lub tekst w HTML, uruchom stemplowanie i opublikuj komplet. W aktualnie otwartym dzienniku wróć do niego online. Zaczekaj na „Nowa wersja gotowa” i sprawdź, że wersja w ustawieniach jeszcze się nie zmieniła. Kliknij „Zaktualizuj” i sprawdź nowy identyfikator, ten sam adres startu oraz historię. Powtórz start offline.
4. W oddzielnym profilu testowym, na kopii danych, ustaw przez DevTools `schemaVersion` na 999 i dodaj znacznik do notatki. Otwórz starszą stronę i sprawdź komunikat, blokadę importu i czyszczenia oraz brak zapisu. Skopiuj surowy backup i CSV z notatką zawierającą znacznik. Porównaj ciąg w localStorage przed i po eksportach. Powtórz ze starszą kartą otwartą w chwili podmiany danych.
5. Sprawdź gest Wstecz przy Gboard, w oknie dialogowym i na głównym ekranie. Na jasnym i ciemnym motywie obejrzyj ekran startowy, pasek systemowy, dolny panel i ikonę launchera.

### Opis commita

- Dodaj manifest standalone, ikony PNG i obsługę offline pod obecną ścieżką.
- Wersjonuj zestaw offline skrótem plików, pokazuj wersję w ustawieniach i aktywuj aktualizację na żądanie.
- Zablokuj zapis nowszego schematu w starszym wydaniu z dostępem do backupu JSON i CSV.

## Iteracja 4b — uproszczenie

„Dziennik interwałów” jest jedynym nagłówkiem głównego ekranu, bo identyfikuje aplikację, a daty i sumy opisują historię. Licznik jest widoczny w obu stanach. Dolny przycisk o wysokości co najmniej 56 CSS px zmienia etykietę ze „Start” na „Koniec interwału”. „Zatrzymaj pomiar” znajduje się przy liczniku i jest dostępne podczas pomiaru. Cele dotykowe mają co najmniej 48 CSS px. Po zamknięciu interwału fokus przechodzi do notatki, a panel dolny odpina się przez CSS na czas jej fokusu.

Karty z commita `fac5bde` są wzorem historii. Pogrubione godziny i długość są w pierwszym wierszu, notatka poniżej. Zachowujemy rozwijane lokalne dni, sumę „Zapisano”, importowane tagi i oznaczenia blokady, długiego wpisu oraz przejścia przez północ. Bieżący wpis i suma jego dnia aktualizują się podczas pomiaru. Podsumowanie według tagów, licznik wpisów i najdłuższy odcinek usunięto z widoku.

„Ustawienia i dane” zawierają pełną kopię JSON, przywracanie, datę kopii, status trwałej pamięci, wersję i „Wyczyść wszystko”. Nad historią pojawia się jedna neutralna linia, gdy nie ma kopii lub ma ona **ponad 7 dni**. Link rozwija ustawienia i przewija do „Kopiuj dane”. Przy odmowie dostępu do schowka pojawia się pole ręcznego kopiowania. Ochrona nowszego schematu pozostawia surową kopię JSON do odczytu. Klucz, schemat, migracje, reguły walidacji i scalania oraz pola `session`, `tag`, `filter` i `wake` są zachowane. Interfejs pomija CSV i przełącznik wygaszania ekranu.

| Rola | Jasny | Ciemny |
|---|---|---|
| Tło / powierzchnia | `#F4F4F4` / `#FFFFFF` | `#121212` / `#1C1C1C` |
| Tekst główny / drugorzędny | `#171717` / `#555555` | `#F5F5F5` / `#B8B8B8` |
| Obrys kontrolki / separator dekoracyjny | `#707070` / `#D4D4D4` | `#888888` / `#3B3B3B` |
| Tło tagu | `#EAEAEA` | `#303030` |
| Akcent / tekst na nim | `#366BCD` / `#FFFFFF` | `#366BCD` / `#FFFFFF` |

`--accent` steruje tłem głównego przycisku i kropką „Trwa”. Kontrast białej etykiety na niebieskim tle wynosi 5,07:1, a akcentu względem powierzchni w jasnym i ciemnym motywie odpowiednio 5,07:1 i 3,36:1. Najniższy kontrast spośród użytych par zwykłego tekstu wynosi 5,07:1. Obrysy kontrolek mają co najmniej 4,50:1 względem tła lub powierzchni. Manifest ma neutralne `#F4F4F4` dla obu kolorów startowych, a HTML dostosowuje kolor motywu do systemu.

Neutralne powierzchnie realizują role z Material Design 3. Oszczędne użycie koloru i spójne oznaczenie stanu tekstem odpowiadają wskazówkom HIG. Usunięcie zbędnych kontroli oraz zwinięcie ustawień odpowiada zasadzie minimalistycznego projektu NN/G. Progi kontrastu wynoszą 4,5:1 dla zwykłego tekstu oraz 3:1 dla informacji potrzebnej do rozpoznania kontrolki lub stanu. [Material Design 3](https://m3.material.io/styles/color/the-color-system/), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/color), [NN/G](https://www.nngroup.com/articles/usability-heuristics-complex-applications/), [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast).

Przed publikacją uruchom `python tools/stamp_release.py` i opublikuj razem HTML, manifest oraz worker. Skrypt odświeża identyfikator wydania i sumy kontrolne, a logika aktywacji po naciśnięciu „Zaktualizuj” pozostaje taka jak w iteracji 4.

### Testy ręczne na Realme 8 5G

1. Zapisz kopię z obecnej wersji poza dziennikiem. Zanotuj treść przykładowego wpisu z tagiem i stan pomiaru. Po udostępnieniu wydania wróć do zainstalowanej PWA, użyj „Zaktualizuj” i sprawdź wersję, historię, etykiety oraz ciągłość pomiaru na tym samym adresie. Potem otwórz aplikację z ikony w trybie samolotowym.
2. Jedną ręką przejdź od „Start” przez kilka kolejnych „Koniec interwału”. Sprawdź, czy każde dotknięcie zamyka jeden wpis i od razu uruchamia następny. W jednym wpisie pomiń notatkę, w innym wpisz tekst i użyj „Gotowe”. Zatrzymaj pomiar obok licznika. Sprawdź powrót do „Start” i widoczne `00:00`.
3. Otwórz i zwiń dzień. Sprawdź, czy bez szukania widać dzisiejszą sumę, pierwsze wpisy i przycisk pomiaru. W długiej historii sprawdź dostępność przycisku u dołu, a przy otwartym Gboard sprawdź, czy pole notatki i „Gotowe” są osiągalne. Obejrzyj oba motywy, większy tekst i wpis przechodzący przez północ.
4. W profilu testowym bez danych lub z kopią starszą niż 7 dni dotknij przypomnienia i sprawdź, czy odsłania „Kopiuj dane”. Skopiuj JSON do schowka, a następnie w osobnym pustym profilu przywróć go przez „Przywróć z kopii”. Porównaj wpisy, tagi, notatki i stan pomiaru. Powtórz import i sprawdź, czy nie dodaje duplikatów. Przy niedostępnym schowku sprawdź pole ręcznego kopiowania.
5. W osobnym profilu testowym ustaw `schemaVersion` na 999. Sprawdź blokadę pomiaru, przywracania i czyszczenia oraz możliwość skopiowania niezmienionej kopii.

Sprawdzono w Chrome przy 360 × 780 CSS px: oba motywy, dotyk, przejście z poprzedniej wersji z zachowaniem danych, pracę offline, dokładny próg przypomnienia, przywrócenie bez duplikatów i blokadę nowszego schematu. Schowek symulowano w obu wariantach. Testy z Gboard i zainstalowaną aplikacją na Realme pozostają do wykonania.

### Opis commita

`Uprość pomiar i przywróć karty historii interwałów`

- Ujednolić start i koniec interwału w jednej dolnej akcji oraz zachować osobne zatrzymanie pomiaru.
- Przywrócić karty wpisów i neutralne motywy z pojedynczym akcentem.
- Zebrać kopiowanie i przywracanie w ustawieniach, przypominać o kopii po siedmiu dniach i ostemplować nowe wydanie offline.

## Iteracja 5 — lokalny dziennik użycia

**KONWENCJA.** Główny stan nadal jest pod kluczem `dziennik-interwalow-v1`. Zapis v3 aktualizuje numer schematu. V1 przechodzi najpierw przez migrację do v2. Lokalny dziennik zdarzeń ma osobny klucz `dziennik-interwalow-events-v1`. Kopia v3 ma dodatkową tablicę `events`. Starszy import zachowuje metryki lokalne. V3 scala poprawne zdarzenia po ID, po udanym zapisie stanu głównego. Import powtórzony dwa razy tworzy dwa zdarzenia użycia przywracania i zachowuje po jednym rekordzie każdego importowanego ID. W nowszym schemacie działa surowy eksport dotychczasowej kopii. „Wyczyść wszystko” usuwa metryki z pamięci i z localStorage.

| Typ | Co mierzy |
|---|---|
| `visible` | Pierwsze pokazanie dokumentu i powrót z ukrycia, wraz z trybem `standalone`, `browser` lub `other`. Przeładowanie tworzy nowy dokument. |
| `note` | Czas od zamknięcia interwału do pierwszej i ostatniej zmiany pola, liczbę punktów kodowych Unicode i przyczynę końca obserwacji. Raport używa domkniętych prób `done` i `replaced`. |
| `action` | Zatrzymanie pomiaru, otwarcie edycji z historii, potwierdzenie usunięcia, żądanie kopii, potwierdzenie importu i żądanie aktualizacji workera. |
| `error` | Obserwowany błąd głównego zapisu, schowka, rejestracji workera albo wykrycie nowszego schematu. Surowy eksport z tej wersji zachowuje oryginalne bajty. |

**Moja ocena.** Bufor utrzymuje maksymalnie 2000 rekordów i 300 000 bajtów zwartej serializacji JSON, łącznie z nawiasami i przecinkami. Walidowane wartości są ASCII, więc liczba jednostek kodowych serializacji jest równa rozmiarowi w UTF-8. Udział w limicie przeglądarki zależy od sposobu naliczania miejsca. Zapis wypiera najstarsze rekordy. Po scaleniu importu porządek między kopiami opiera się na zapisanym czasie. Przycisk dokłada rekord w pamięci. Zapis odbywa się po ok. 800 ms od rozpoczęcia partii, przy `hidden` lub `pagehide`. Awaria zapisu porzuca partię bez komunikatu i ponowienia. Przy braku miejsca na główne dane aplikacja zwalnia miejsce zajęte przez dziennik i ponawia główny zapis. [MDN Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

**FAKT.** `performance.now()` jest monotoniczny, a przeglądarki różnią się zachowaniem podczas uśpienia. Zegar monotoniczny mierzy zwłokę wpisywania w widocznym dokumencie. `Date.now()` i przesunięcie UTC służą do dat i godzin. Przy ręcznej zmianie zegara dodatnia luka między dokumentami może wyglądać jak przerwa. Nagłe zakończenie procesu może utracić partię, a odtworzony dokument da nowe otwarcie. [MDN Performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now), [MDN visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event), [MDN display-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode)

### Czego NIE zrobię

- Na użytek metryk aplikacja nie dodaje elementów UI, zasobów, ruchu sieciowego ani nasłuchu dotknięć.
- Dziennik nie zawiera tekstu użytkownika, kopiowanych treści, identyfikatorów wpisów ani komunikatów wyjątków. Pełna kopia nadal zawiera notatki potrzebne do przywracania.
- Manifest i logika instalacji, cache, offline oraz aktywacji aktualizacji pozostają jak wcześniej. Skrypt wydania przelicza znaczniki i sumy offline.

### Czytanie kopii

`python tools/summarize_metrics.py backup.json` czyta plik. `Get-Clipboard -Raw | python tools/summarize_metrics.py -` czyta JSON przekazany przez PowerShell na stdin. Do analizy można wkleić wynik skryptu. Przerwy dotyczą zarejestrowanych śladów użycia. Liczba granic pomiaru z wpisów jest przybliżeniem obejmującym Stop oraz wnioskowane starty. Raport podaje mianowniki i zakres danych.

### Testy ręczne

1. W osobnym profilu zapisz kopię v2 z trwającym pomiarem i notatką. Otwórz nowe wydanie. Sprawdź, że v3 zachował pomiar, wpis, znacznik blokady i notatkę. Zaimportuj kopie v1 i v2, a v3 przywróć dwa razy. Porównaj tablice wpisów i ID zdarzeń. Kolejne potwierdzenie importu ma własne zdarzenie `restore`.
2. Po zakończeniu interwału wpisz `TAJNA-NOTATKA😀`, dotknij „Gotowe” i skopiuj dane. W JSON znajdź tekst w `entries[].note` i sprawdź, że wyszukanie go w `JSON.stringify(kopia.events)` nic nie zwróci. Rekord `note` powinien mieć `chars: 14`, dwie wartości czasu i `end: "done"`.
3. Zaimportuj kopię v3 z 2005 poprawnymi zdarzeniami o różnych ID. Po sekundzie sprawdź w DevTools `localStorage.getItem('dziennik-interwalow-events-v1')`. Odczytana tablica ma najwyżej 2000 rekordów, a `new TextEncoder().encode(raw).length` ma najwyżej 300 000. Najstarsze ID wypadają. Użyj „Wyczyść wszystko” w tym samym profilu i sprawdź, że klucz zdarzeń zniknął.
4. W konsoli profilu testowego podstaw `Storage.prototype.setItem`, które rzuca `QuotaExceededError` wyłącznie dla klucza zdarzeń. Zamknij interwał i odczekaj sekundę. Nowy wpis jest w głównym kluczu, nie ma komunikatu o błędzie metryk. Odśwież stronę, żeby przywrócić oryginalną metodę.
5. Porównaj ekran poprzedniej i nowej wersji z tymi samymi danymi w 360 × 780 CSS px. Na Androidzie uruchom z ikony, wróć z tła, otwórz też kartę Chrome i porównaj `visible` w kopii. Zainstaluj wydanie, włącz tryb samolotowy, uruchom z ikony i zamknij interwał z notatką. Sprawdź aktualizację przyciskiem po kolejnym wydaniu.

W Chrome headless sprawdzono migrację aktywnego pomiaru, import v1/v2/v3, brak duplikatów importowanych ID, prywatność metryk, oba limity, czyszczenie, pierwszeństwo zapisu głównego, eksport nowszego schematu, tryb offline i zgodność układu kontrolek w 360 × 780 CSS px. Test limitu bajtów zatrzymał się na 299 981 bajtach i 1911 rekordach. Powrót z ukrycia i błąd schowka były symulowane. Instalacja, uśpienie, Gboard i aktualizacja przyciskiem na Realme pozostają do sprawdzenia.

### Opis commita

`Dodaj lokalny dziennik użycia i kopie v3`

- Zbieraj lokalnie otwarcia, pierwsze edycje notatek, rzadkie akcje i błędy w ograniczonym buforze.
- Scalaj dziennik z kopią v3 i zachowaj import v1 oraz v2.
- Dodaj podsumowanie sześciu pytań z pliku lub stdin i odśwież wydanie offline.
