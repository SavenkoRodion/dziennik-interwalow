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
